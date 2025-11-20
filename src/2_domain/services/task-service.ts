import { ITaskService } from "../../1_inbound/ports/services/I-task-service";
import { TaskReqDto, ProjectTaskReqDto, TaskInfoReqDto } from "../../1_inbound/requests/task-req-dto";
import { TaskResDto, TaskResDtos } from "../../1_inbound/responses/task-res-dto";
import { TaskMapper } from "../../3_outbound/mappers/task-mapper";
import { IRepository } from "../ports/I-repository";

export class TaskService implements ITaskService {
  private _repo;
  constructor(repositories: IRepository) {
    this._repo = repositories;
  }

  async createTask(dto: TaskReqDto): Promise<TaskResDto> {
    const newTaskEntity = TaskMapper.toEntity(dto);
    const persistTaskEntity =
      await this._repo.taskRepository.create(newTaskEntity);
    const taskResDto = TaskMapper.toResDto(persistTaskEntity);
    return taskResDto;
  }

  async getProjectTasks(dto: ProjectTaskReqDto): Promise<TaskResDtos> {
    const viewTaskEntity = TaskMapper.toViewEntity(dto);
    const persistTaskEntities =
      await this._repo.taskRepository.getProjectTasks(viewTaskEntity);
    const taskResDtos = TaskMapper.toResDtos(persistTaskEntities);
    return taskResDtos;
  }

  async getTaskInfo(dto: TaskInfoReqDto): Promise<TaskResDto> {
    const viewTaskEntity = TaskMapper.toModifyTaskEntity(dto);
    const persistTaskEntity =
      await this._repo.taskRepository.getTaskInfo(viewTaskEntity);
    const taskResDtos = TaskMapper.toResDto(persistTaskEntity);
    return taskResDtos;
  }

  async editTaskInfo(dto: TaskReqDto): Promise<TaskResDto> {
    const newTaskEntity = TaskMapper.toEntity(dto);
    const persistTaskEntity =
      await this._repo.taskRepository.update(newTaskEntity);
    const taskResDto = TaskMapper.toResDto(persistTaskEntity);
    return taskResDto;
  }

}
