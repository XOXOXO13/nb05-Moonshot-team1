import { ITaskService } from "../../1_inbound/ports/services/I-task-service";
import { TaskReqDto } from "../../1_inbound/requests/task-req-dto";
import { TaskResDto } from "../../1_inbound/responses/task-res-dto";
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
}
