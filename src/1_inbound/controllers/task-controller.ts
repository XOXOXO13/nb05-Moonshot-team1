import { Request, Response } from "express";
import { IServices } from "../ports/I-services";
import { BaseController } from "./base-controller";
import { TaskReqDto } from "../requests/task-req-dto";
import { taskReqSchema } from "../requests/task-req-dto";
import { Console } from "console";

export class TaskController extends BaseController {
  constructor(services: IServices) {
    super({ basePath: "/", services: services });
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post("/projects/:projectId/tasks", this.createTask);
  }

  createTask = async (req: Request, res: Response) => {
    const reqData = taskReqSchema.safeParse({
      body: req.body,
      params: req.params,
      headers: req.headers,
    });

    if (!reqData.success) {
      return res.status(400).json({
        message: "잘못된 요청 형식",
      });
    }

    const taskReqDto = reqData.data;
    const taskResDto = await this.services.taskService.createTask(taskReqDto);
    res.json(taskResDto);
  };
}
