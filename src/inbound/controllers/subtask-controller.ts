import { Request, Response } from "express";
import { BaseController } from "./base-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { IServices } from "../ports/I-services";
import {
  createSubTaskBodySchema,
  createSubTaskParamsSchema,
  deleteSubTaskParamsSchema,
  subTaskInfoParamsSchema,
  subTaskParamsSchema,
  subTaskQuerySchema,
  updateSubTaskBodySchema,
  updateSubTaskParamsSchema,
} from "../requests/subtask-req-dto";

export class SubTaskController extends BaseController {
  private readonly _authMiddlewares;
  constructor(services: IServices, authMiddleware: AuthMiddleware) {
    super({ basePath: "/", services: services });
    this._authMiddlewares = authMiddleware;
    this.registerRoutes();
  }

  registerRoutes() {
    // 하위 할 일 생성
    this.router.post(
      "/tasks/:taskId/subtasks",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.createSubTask),
    );

    // 하위 할 일 목록 조회
    this.router.get(
      "/tasks/:taskId/subtasks",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.getSubTasks),
    );

    // 할 일 조회
    this.router.get(
      "/subtasks/:subtaskId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.getSubTaskInfo),
    );

    // 하위 할 일 수정
    this.router.patch(
      "/subtasks/:subtaskId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.editSubTaskInfo),
    );

    // 하위 할 일 삭제
    this.router.delete(
      "/subtasks/:subtaskId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.deleteSubTask),
    );
  }

  createSubTask = async (req: Request, res: Response) => {
    const body = this.validate(createSubTaskBodySchema, req.body);
    const params = this.validate(createSubTaskParamsSchema, req.params);

    const subTaskResDto = await this.services.subtask.createSubTask({
      ...body,
      ...params,
      userId: Number(req.userId),
    });

    res.json(subTaskResDto);
  };

  getSubTasks = async (req: Request, res: Response) => {
    const params = this.validate(subTaskParamsSchema, req.params);
    const query = this.validate(subTaskQuerySchema, req.query);

    const subTaskResDto = await this.services.subtask.getSubTasks({
      ...params,
      ...query,
      userId: Number(req.userId),
    });

    res.json(subTaskResDto);
  };

  getSubTaskInfo = async (req: Request, res: Response) => {
    const params = this.validate(subTaskInfoParamsSchema, req.params);

    const subTaskResDto = await this.services.subtask.getSubTaskInfo({
      ...params,
      userId: Number(req.userId),
    });

    res.json(subTaskResDto);
  };

  editSubTaskInfo = async (req: Request, res: Response) => {
    const body = this.validate(updateSubTaskBodySchema, req.body);
    const params = this.validate(updateSubTaskParamsSchema, req.params);

    const subTaskResDto = await this.services.subtask.editSubTaskInfo({
      ...body,
      ...params,
      userId: Number(req.userId),
    });

    res.json(subTaskResDto);
  };

  deleteSubTask = async (req: Request, res: Response) => {
    const params = this.validate(deleteSubTaskParamsSchema, req.params);

    await this.services.subtask.deleteSubTaskInfo({
      ...params,
      userId: Number(req.userId),
    });

    res.status(200).json();
  };
}
