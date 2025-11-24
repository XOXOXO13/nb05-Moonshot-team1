import { Request, Response } from "express";
import { BaseController } from "./base-controller";
import { TaskMapper } from "../../outbound/mappers/task-mapper";
import { IServices } from "../ports/I-services";
import {
  createTaskReqSchema,
  updateTaskReqSchema,
  viewProjectTaskReqSchema,
  viewTaskInfoReqSchema,
} from "../requests/task-req-dto";

export class TaskController extends BaseController {
  constructor(services: IServices) {
    super({ basePath: "/", services: services });
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post("/projects/:projectId/tasks", this.createTask);
    this.router.get("/projects/:projectId/tasks", this.getProjectTasks);
    this.router.get("/tasks/:taskId", this.getTaskInfo);
    this.router.patch("/tasks/:taskId", this.editTaskInfo);
    this.router.delete("/tasks/:taskId", this.deleteTask);
  }

  createTask = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(createTaskReqSchema, req);
    const taskResDto = await this.services.task.createTask(taskReqDto);
    res.json(taskResDto);
  };

  getProjectTasks = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(viewProjectTaskReqSchema, req);
    const taskResDto = await this.services.task.getProjectTasks(taskReqDto);
    res.json(taskResDto);
  };

  getTaskInfo = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(viewTaskInfoReqSchema, req);
    const taskResDto = await this.services.task.getTaskInfo(taskReqDto);
    res.json(taskResDto);
  };

  editTaskInfo = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(updateTaskReqSchema, req);
    const taskResDto = await this.services.task.editTaskInfo(taskReqDto);
    res.json(taskResDto);
  };

  deleteTask = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(viewTaskInfoReqSchema, req);
    await this.services.task.deleteTaskInfo(taskReqDto);
    res.status(200).json();
  };
}
