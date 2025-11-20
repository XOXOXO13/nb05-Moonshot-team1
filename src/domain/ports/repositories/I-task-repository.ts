import { PersistTaskEntity } from "../../entites/task/persist-task-entity";
import { ModifyTaskEntity } from "../../entites/task/task-entity";
import {
  ViewProjectTaskEntity,
  ViewTaskEntity,
} from "../../entites/task/view-task-entity";

export interface ITaskRepository {
  create(entity: ModifyTaskEntity): Promise<PersistTaskEntity>;
  getProjectTasks(entity: ViewProjectTaskEntity): Promise<PersistTaskEntity[]>;
  getTaskInfo(entity: ViewTaskEntity): Promise<PersistTaskEntity>;
  update(entity: ModifyTaskEntity): Promise<PersistTaskEntity>;
  delete(entity: ViewTaskEntity): Promise<void>;
}
