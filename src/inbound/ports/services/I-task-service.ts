import { PersistTaskEntity } from "../../../domain/entites/task/task-entity";
import { TaskReqDto, TaskViewReqDto } from "../../requests/task-req-dto";
import { TaskResDto } from "../../responses/task-res-dto";

export interface ITaskService {
  createTask(reqDto: TaskReqDto): Promise<TaskResDto>;
}
