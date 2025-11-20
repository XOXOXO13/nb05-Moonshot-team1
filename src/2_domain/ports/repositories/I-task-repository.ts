import { ProjectTaskReqDto } from "../../../1_inbound/requests/task-req-dto";
import { ViewTaskEntity, PersistTaskEntity, TaskEntity, ViewProjectTaskEntity } from "../../entites/task/task-entity";

export interface ITaskRepository {
  create(entity: TaskEntity): Promise<PersistTaskEntity>;
  getProjectTasks(entity: ViewProjectTaskEntity): Promise<PersistTaskEntity[]>;
  getTaskInfo(entity: ViewTaskEntity): Promise<PersistTaskEntity>
  update(entity: TaskEntity): Promise<PersistTaskEntity>;
}
