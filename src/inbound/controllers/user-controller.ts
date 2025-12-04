import { PrismaClient } from "@prisma/client";
import { BaseController } from "./base-controller";
import { IServices } from "../ports/I-services";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { Response } from "express";
import {
  getUserTasksReqSchema,
  GetUserTasksQueryParams,
} from "../requests/user-req-dto";
import { GetUserTasksResDto } from "../responses/user-dto";

export class UsersController extends BaseController {
  private readonly _prisma: PrismaClient;

  constructor(
    services: IServices,
    private _authMiddleware: AuthMiddleware,
    prisma?: PrismaClient,
  ) {
    super({
      basePath: "/users",
      services,
    });
    this._prisma = prisma || new PrismaClient();
    this.registerUserRoutes();
  }

  private registerUserRoutes() {
    this.router.get(
      "/me",
      this.catch(this._authMiddleware.validateAccessToken),
      this.catch(this.getMe),
    );

    this.router.patch(
      "/me",
      this.catch(this._authMiddleware.validateAccessToken),
      this.catch(this.updateMe),
    );
    this.router.get(
      "/me/projects",
      this.catch(this._authMiddleware.validateAccessToken),
      this.catch(this.getUserProjects),
    );
    this.router.get(
      "/me/tasks",
      this.catch(this._authMiddleware.validateAccessToken),
      this.catch(this.getUserTasks),
    );
  }

  getMe = async (req: any, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          message: "잘못된 요청입니다.",
        });
      }
      const user = await this.services.user.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "잘못된 요청입니다",
        });
      }
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImageUrl || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error: any) {
      console.error("GetMe error:", error);

      return res.status(400).json({
        message: "잘못된 요청입니다",
      });
    }
  };
  updateMe = async (req: any, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: "잘못된 요청입니다",
        });
      }

      const { name, profileImageUrl } = req.body;

      if (name !== undefined && !name) {
        return res.status(400).json({
          message: "잘못된 요청입니다",
        });
      }
      const user = await this.services.user.updateProfile(userId, {
        name,
        profileImageUrl,
      });
      return res.status(200).json({
        message: "사용자 정보가 업데이트되었습니다.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImage: user.profileImageUrl || null,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error: any) {
      console.error("UpdateMe error:", error);

      if (error.message?.includes("not found")) {
        return res.status(404).json({
          message: "잘못된 요청입니다",
        });
      }

      return res.status(400).json({
        message: "잘못된 요청입니다",
      });
    }
  };
  getUserProjects = async (req: any, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          message: "잘못된 요청입니다",
        });
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const order_by = (req.query.order_by as string) || "created_at";
      const order = (req.query.order as string) || "desc";
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          message: "유효하지 않은 페이지 또는 limit입니다",
        });
      }

      if (!["created_at", "name"].includes(order_by)) {
        return res.status(400).json({
          message: "유효하지 않은 order_by입니다",
        });
      }

      if (!["asc", "desc"].includes(order)) {
        return res.status(400).json({
          message: "유효하지 않은 order입니다",
        });
      }
      const prisma = this._prisma;

      try {
        // 모든 프로젝트를 조회합니다.
        const projects = await prisma.project.findMany({
          // where 조건 제거: 특정 userId에 대한 필터링이 없어집니다.
          // where: { /* 기존 조건 삭제 */ },

          include: {
            members: true,
            tasks: true,
          },
          orderBy: {
            [order_by === "created_at" ? "createdAt" : "name"]: order,
          },
          skip: (page - 1) * limit,
          take: limit,
        });

        const total = await prisma.project.count({
          where: {
            OR: [
              { userId: userId },
              {
                members: {
                  some: {
                    userId: userId,
                  },
                },
              },
            ],
          },
        });
        const data = projects.map((project) => {
          const todoCount =
            project.tasks?.filter((t) => t.status === "TODO").length || 0;
          const inProgressCount =
            project.tasks?.filter((t) => t.status === "IN_PROGRESS").length ||
            0;
          const doneCount =
            project.tasks?.filter((t) => t.status === "DONE").length || 0;

          return {
            id: project.id,
            name: project.name,
            description: project.description || null,
            memberCount: project.members?.length || 0,
            todoCount,
            inProgressCount,
            doneCount,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
          };
        });
        return res.status(200).json({
          data,
          total,
        });
      } catch (error: any) {
        console.error("GetUserProjects error:", error);

        return res.status(400).json({
          message: "잘못된 요청입니다",
        });
      }
    } catch (error: any) {
      console.error("GetUserProjects error:", error);

      return res.status(400).json({
        message: "잘못된 요청입니다",
      });
    }
  };
  getUserTasks = async (req: any, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          message: "로그인이 필요합니다.",
        });
      }

      const queryParams = this.parseUserTasksQuery(req.query);
      const tasks = await this._prisma.task.findMany({
        where: this.buildUserTasksWhereClause(userId, queryParams),
        include: {
          assignee: true,
          project: true,
          attachments: true,
          taskTags: {
            include: { tag: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const data = tasks.map((task) => this.mapTaskToResponse(task));

      return res.status(200).json(data);
    } catch (error: any) {
      console.error("GetUserTasks error:", error);
      return res.status(400).json({
        message: "잘못된 요청입니다",
      });
    }
  };

  private parseUserTasksQuery(query: any): GetUserTasksQueryParams {
    const from = (query.from as string) || null;
    const to = (query.to as string) || null;
    const projectId = query.project_id
      ? parseInt(query.project_id as string)
      : null;
    const status = (query.status as string) || null;
    const assigneeId = query.assignee_id
      ? parseInt(query.assignee_id as string)
      : null;
    const keyword = (query.keyword as string) || null;

    if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) {
      throw new Error("from 날짜 형식이 유효하지 않습니다 (YYYY-MM-DD)");
    }
    if (to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
      throw new Error("to 날짜 형식이 유효하지 않습니다 (YYYY-MM-DD)");
    }

    if (status && !["todo", "in_progress", "done"].includes(status)) {
      throw new Error("status는 todo, in_progress, done 중 하나여야 합니다");
    }

    return { from, to, projectId, status, assigneeId, keyword };
  }

  private buildUserTasksWhereClause(
    userId: number,
    queryParams: GetUserTasksQueryParams,
  ): any {
    const where: any = {
      assigneeId: userId,
    };

    if (queryParams.from || queryParams.to) {
      where.startDate = {};
      if (queryParams.from) {
        where.startDate.gte = new Date(queryParams.from);
      }
      if (queryParams.to) {
        const toDate = new Date(queryParams.to);
        toDate.setDate(toDate.getDate() + 1);
        where.startDate.lt = toDate;
      }
    }

    if (queryParams.projectId) {
      where.projectId = queryParams.projectId;
    }

    if (queryParams.status) {
      where.status = queryParams.status.toUpperCase();
    }

    if (queryParams.assigneeId && queryParams.assigneeId !== userId) {
      where.assigneeId = queryParams.assigneeId;
    }

    if (queryParams.keyword) {
      where.title = {
        contains: queryParams.keyword,
      };
    }

    return where;
  }

  private mapTaskToResponse(task: any): GetUserTasksResDto {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);

    return {
      id: task.id,
      projectId: task.projectId,
      title: task.title,
      startYear: startDate.getFullYear(),
      startMonth: startDate.getMonth() + 1,
      startDay: startDate.getDate(),
      endYear: endDate.getFullYear(),
      endMonth: endDate.getMonth() + 1,
      endDay: endDate.getDate(),
      status: task.status.toLowerCase() as "todo" | "in_progress" | "done",
      assignee: task.assignee
        ? {
            id: task.assignee.id,
            name: task.assignee.name,
            email: task.assignee.email,
            profileImage: task.assignee.profileImage || null,
          }
        : null,
      tags:
        task.taskTags?.map((tt: any) => ({
          id: tt.tag.id,
          name: tt.tag.name,
        })) || [],
      attachments:
        task.attachments?.map((att: any) => ({
          id: att.id,
          url: att.attachmentUrl,
        })) || [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
