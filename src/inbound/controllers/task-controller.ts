import { Request, Response } from "express";
import { BaseController } from "./base-controller";

import { AuthMiddleware } from "../middlewares/auth-middleware";
import {
  createTaskBodySchema,
  createTaskParamsSchema,
  deleteTaskParamsSchema,
  projectTaskParamsSchema,
  projectTaskQuerySchema,
  taskInfoParamsSchema,
  updateTaskBodySchema,
  updateTaskParamsSchema,
} from "../requests/task-req-dto";
import { IServices } from "../ports/I-services";

export class TaskController extends BaseController {
  private readonly _authMiddlewares;
  constructor(services: IServices, authMiddleware: AuthMiddleware) {
    super({ basePath: "/", services: services });
    this._authMiddlewares = authMiddleware;
    this.registerRoutes();
  }

  registerRoutes() {
    // 할 일 생성
    this.router.post(
      "/projects/:projectId/tasks",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.createTask),
    );

    // 프로젝트 할 일 조회
    this.router.get(
      "/projects/:projectId/tasks",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.getProjectTasks),
    );

    // 할 일 상세조회
    this.router.get(
      "/tasks/:taskId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.getTaskInfo),
    );

    // 할 일 수정
    this.router.patch(
      "/tasks/:taskId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.editTaskInfo),
    );

    // 할 일 삭제
    this.router.delete(
      "/tasks/:taskId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.deleteTask),
    );
  }

  createTask = async (req: Request, res: Response) => {
    const body = this.validate(createTaskBodySchema, req.body);
    const params = this.validate(createTaskParamsSchema, req.params);

    const taskResDto = await this.services.task.createTask({
      ...body,
      ...params,
      userId: Number(req.userId),
    });

    res.json(taskResDto);
  };

  getProjectTasks = async (req: Request, res: Response) => {
    const params = this.validate(projectTaskParamsSchema, req.params);
    const query = this.validate(projectTaskQuerySchema, req.query);

    const taskResDto = await this.services.task.getProjectTasks({
      ...params,
      ...query,
      userId: Number(req.userId),
    });

    res.json(taskResDto);
  };

  getTaskInfo = async (req: Request, res: Response) => {
    const params = this.validate(taskInfoParamsSchema, req.params);
    const taskResDto = await this.services.task.getTaskInfo({
      ...params,
      userId: Number(req.userId),
    });
    res.json(taskResDto);
  };

  editTaskInfo = async (req: Request, res: Response) => {
    const body = this.validate(updateTaskBodySchema, req.body);
    const params = this.validate(updateTaskParamsSchema, req.params);

    const taskResDto = await this.services.task.editTaskInfo({
      ...body,
      ...params,
      userId: Number(req.userId),
    });

    res.json(taskResDto);
  };

  deleteTask = async (req: Request, res: Response) => {
    const params = this.validate(deleteTaskParamsSchema, req.params);
    await this.services.task.deleteTaskInfo({
      ...params,
      userId: Number(req.userId),
    });
    res.status(200).json();
  };
}
