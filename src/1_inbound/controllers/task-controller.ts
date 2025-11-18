import { Request, Response } from "express";
import { IServices } from "../ports/I-services";
import { BaseController } from "./base-controller";
import { TaskMapper } from "../../3_outbound/mappers/task-mapper";

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
    const taskResDto = await this.services.taskService.createTask(taskReqDto);
    res.json(taskResDto);
  };
}
