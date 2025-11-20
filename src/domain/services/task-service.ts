import { ITaskService } from "../../inbound/ports/services/I-task-service";
import {
  CreateTaskReqDto,
  ProjectTaskReqDto,
  TaskInfoReqDto,
  UpdateTaskReqDto,
} from "../../inbound/requests/task-req-dto";
import { TaskResDto, TaskResDtos } from "../../inbound/responses/task-res-dto";
import { TaskMapper } from "../../outbound/mappers/task-mapper";
import { ModifyTaskEntity } from "../entites/task/task-entity";
import { ViewTaskEntity } from "../entites/task/view-task-entity";
import { IRepositories } from "../ports/repositories-interface";

export class TaskService implements ITaskService {
  private _repo;
  constructor(repositories: IRepositories) {
    this._repo = repositories;
  }

  async createTask(dto: CreateTaskReqDto): Promise<TaskResDto> {
    const newTaskEntity = ModifyTaskEntity.toCreateTaskEntity(dto);
    const persistTaskEntity =
      await this._repo.taskRepository.create(newTaskEntity);
    const taskResDto = TaskMapper.toResDto(persistTaskEntity);
    return taskResDto;
  }

  async getProjectTasks(dto: ProjectTaskReqDto): Promise<TaskResDtos> {
    const viewTaskEntity = ViewTaskEntity.toViewProjectTaskEntity(dto);
    const persistTaskEntities =
      await this._repo.taskRepository.getProjectTasks(viewTaskEntity);
    const taskResDtos = TaskMapper.toResDtos(persistTaskEntities);
    return taskResDtos;
  }

  async getTaskInfo(dto: TaskInfoReqDto): Promise<TaskResDto> {
    const viewTaskEntity = ViewTaskEntity.toViewTaskInfoEntity(dto);
    const persistTaskEntity =
      await this._repo.taskRepository.getTaskInfo(viewTaskEntity);
    const taskResDtos = TaskMapper.toResDto(persistTaskEntity);
    return taskResDtos;
  }

  async editTaskInfo(dto: UpdateTaskReqDto): Promise<TaskResDto> {
    const newTaskEntity = ModifyTaskEntity.toUpdateTaskEntity(dto);
    const persistTaskEntity =
      await this._repo.taskRepository.update(newTaskEntity);
    const taskResDto = TaskMapper.toResDto(persistTaskEntity);
    return taskResDto;
  }

  async deleteTaskInfo(dto: TaskInfoReqDto): Promise<void> {
    const newTaskEntity = ViewTaskEntity.toViewTaskInfoEntity(dto);
    await this._repo.taskRepository.delete(newTaskEntity);
  }
}
