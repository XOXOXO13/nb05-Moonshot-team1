import { ITaskService } from "../../inbound/ports/services/I-task-service";
import { TaskReqDto } from "../../inbound/requests/task-req-dto";
import { TaskResDto } from "../../inbound/responses/task-res-dto";
import { TaskMapper } from "../../outbound/mappers/task-mapper";
import { IRepositories } from "../ports/repositories-interface";

export class TaskService implements ITaskService {
  private _repo;
  constructor(repositories: IRepositories) {
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
