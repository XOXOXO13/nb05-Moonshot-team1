import { ITaskService } from "../../inbound/ports/services/I-task-service";
import {
  CreateTaskDto,
  ProjectTaskDto,
  TaskDto,
  UpdateTaskDto,
} from "../../inbound/requests/task-req-dto";
import { TaskResDto, TaskResDtos } from "../../inbound/responses/task-res-dto";
import { TaskMapper } from "../../outbound/mappers/task-mapper";
import { TaskEntity } from "../entites/task/task-entity";
import { TaskQuery } from "../entites/task/view-task-entity";
import { IRepositories } from "../ports/repositories-interface";

export class TaskService implements ITaskService {
  private _repo;
  constructor(repositories: IRepositories) {
    this._repo = repositories;
  }

  async createTask(dto: CreateTaskDto): Promise<TaskResDto> {
    const entity = TaskEntity.fromCreateDto(dto);
    const task = await this._repo.taskRepository.create(entity);
    return TaskMapper.toResDto(task);
  }

  async getProjectTasks(dto: ProjectTaskDto): Promise<TaskResDtos> {
    const entity = TaskQuery.fromProjectTaskDto(dto);
    const tasks = await this._repo.taskRepository.getProjectTasks(entity);
    return TaskMapper.toResDtos(tasks);
  }

  async getTaskInfo(dto: TaskDto): Promise<TaskResDto> {
    const entity = TaskQuery.fromTaskInfoDto(dto);
    const task = await this._repo.taskRepository.getTaskInfo(entity);
    return TaskMapper.toResDto(task);
  }

  async editTaskInfo(dto: UpdateTaskDto): Promise<TaskResDto> {
    const entity = TaskEntity.fromUpdateDto(dto);
    const task = await this._repo.taskRepository.update(entity);
    return TaskMapper.toResDto(task);
  }

  async deleteTaskInfo(dto: TaskDto): Promise<void> {
    const entity = TaskQuery.fromTaskInfoDto(dto);
    await this._repo.taskRepository.delete(entity);
  }
}
