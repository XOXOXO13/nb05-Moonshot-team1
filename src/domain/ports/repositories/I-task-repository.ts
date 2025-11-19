import { TaskViewReqDto } from "../../../inbound/requests/task-req-dto";
import { PersistTaskEntity, TaskEntity } from "../../entites/task/task-entity";

export interface ITaskRepository {
  create(entity: TaskEntity): Promise<PersistTaskEntity>;
}
