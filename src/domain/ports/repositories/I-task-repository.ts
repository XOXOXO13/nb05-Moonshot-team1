import { PersistTaskEntity } from "../../entities/task/persist-task-entity";
import { ModifyTaskEntity } from "../../entities/task/task-entity";
import {
  ViewProjectTaskEntity,
  ViewTaskEntity,
} from "../../entities/task/view-task-entity";

export interface ITaskRepository {
  create(entity: ModifyTaskEntity): Promise<PersistTaskEntity>;
  getProjectTasks(entity: ViewProjectTaskEntity): Promise<PersistTaskEntity[]>;
  getTaskInfo(entity: ViewTaskEntity): Promise<PersistTaskEntity>;
  update(entity: ModifyTaskEntity): Promise<PersistTaskEntity>;
  delete(entity: ViewTaskEntity): Promise<void>;
}
