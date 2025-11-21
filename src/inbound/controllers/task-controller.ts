import { Request, Response } from "express";
import { BaseController } from "./base-controller";
import { TaskMapper } from "../../outbound/mappers/task-mapper";
import { IServices } from "../../inbound/ports/services-interface";
import {
  createTaskSchema,
  updateTaskSchema,
  ProjectTaskSchema,
  TaskInfoReqSchema,
} from "../requests/task-req-dto";

export class TaskController extends BaseController {
  constructor(services: IServices) {
    super({ basePath: "/", services: services });
    this.registerRoutes();
  }

  registerRoutes() {
    // 할 일 생성
    this.router.post(
      "/projects/:projectId/tasks",
      this.catch(this.createTask)
    );


    // 프로젝트 할 일 조회
    this.router.get(
      "/projects/:projectId/tasks",
      this.catch(this.getProjectTasks)
    );

    // 할 일 상세조회
    this.router.get(
      "/tasks/:taskId",
      this.catch(this.getTaskInfo)
    );


    // 할 일 수정
    this.router.patch(
      "/tasks/:taskId",
      this.catch(this.editTaskInfo)
    );


    // 할 일 삭제
    this.router.delete(
      "/tasks/:taskId",
      this.catch(this.deleteTask)
    );
  }

  createTask = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(createTaskSchema, req);
    const taskResDto = await this.services.task.createTask(taskReqDto);
    res.json(taskResDto);
  };

  getProjectTasks = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(ProjectTaskSchema, req);
    const taskResDto = await this.services.task.getProjectTasks(taskReqDto);
    res.json(taskResDto);
  };

  getTaskInfo = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(TaskInfoReqSchema, req);
    const taskResDto = await this.services.task.getTaskInfo(taskReqDto);
    res.json(taskResDto);
  };

  editTaskInfo = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(updateTaskSchema, req);
    const taskResDto = await this.services.task.editTaskInfo(taskReqDto);
    res.json(taskResDto);
  };

  deleteTask = async (req: Request, res: Response) => {
    const taskReqDto = TaskMapper.toReqDto(TaskInfoReqSchema, req);
    await this.services.task.deleteTaskInfo(taskReqDto);
    res.status(200).json();
  };
}
