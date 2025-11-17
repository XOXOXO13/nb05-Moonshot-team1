import { ITaskService } from "../../1_inbound/ports/services/I-task-service";
import { TaskReqDto } from "../../1_inbound/requests/task-req-dto";
import { TaskResDto } from "../../1_inbound/responses/task-res-dto";
import { PersistTaskEntity, TaskEntity } from "../entites/task/task-entity";
import { IRepository } from "../ports/I-repository";

export class TaskService implements ITaskService {
  private _repo;
  constructor(repositories: IRepository) {
    this._repo = repositories;
  }

  async createTask(dto: TaskReqDto): Promise<TaskResDto> {
    const newTaskEntity = new TaskEntity(dto);
    const persistTaskEntity =
      await this._repo.taskRepository.create(newTaskEntity);
    const taskResDto = new TaskResDto(persistTaskEntity);
    return taskResDto;
  }
}
