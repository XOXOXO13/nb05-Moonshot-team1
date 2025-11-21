import { PersistTaskEntity } from "../../entites/task/persist-task-entity";
import { TaskEntity } from "../../entites/task/task-entity";
import {
  ViewProjectTaskEntity,
  TaskQuery,
} from "../../entites/task/view-task-entity";

export interface ITaskRepository {
  create(entity: TaskEntity): Promise<PersistTaskEntity>;
  getProjectTasks(entity: ViewProjectTaskEntity): Promise<PersistTaskEntity[]>;
  getTaskInfo(entity: TaskQuery): Promise<PersistTaskEntity>;
  update(entity: TaskEntity): Promise<PersistTaskEntity>;
  delete(entity: TaskQuery): Promise<void>;
}
