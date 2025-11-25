import { PrismaClient } from "@prisma/client";
import { BaseController } from "./base-controller";
import { IServices } from "../ports/I-services";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { Response } from "express";

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
        const projects = await prisma.project.findMany({
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
      return res.status(501).json({
        message: "아직 구현되지 않은 기능입니다.",
      });
    } catch (error: any) {
      console.error("GetUserTasks error:", error);

      return res.status(400).json({
        message: "잘못된 요청입니다",
      });
    }
  };

  /**
   * 내 할일 조회
   * GET /user/me/tasks
   *
   * 헤더:
   * Authorization: Bearer <accessToken>
   *
   * 응답 (200 OK):
   * [...할일 목록]
   *
   * 상태: 나중에 구현...
   */
}
