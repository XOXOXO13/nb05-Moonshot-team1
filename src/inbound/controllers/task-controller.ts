import { Request, Response } from "express";
import { BaseController } from "./base-controller";
import { TaskMapper } from "../../outbound/mappers/task-mapper";
import { IServices } from "../../inbound/ports/services-interface";

export class TaskController extends BaseController {
  constructor(services: IServices) {
    super({ basePath: "/", services: services });
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post("/projects/:projectId/tasks", this.createTask);
  }

  createTask = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(req);
    const taskResDto = await this.services.task.createTask(taskReqDto);
    res.json(taskResDto);
  };
}
