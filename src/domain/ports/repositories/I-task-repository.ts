import { NewTagEntity } from "../../entites/tag/tag-entity";
import { NewAttachmentEntity } from "../../entites/task/attachment-entity";
import {
  NewTaskEntity,
  PersistTaskEntity,
  TaskEntity,
} from "../../entites/task/task-entity";

export interface ITaskRepository {
  create(entity: NewTaskEntity): Promise<PersistTaskEntity>;
  getProjectTasks(params: {
    page?: number;
    limit?: number;
    status?: string;
    assignee?: number;
    keyword?: string;
    order?: string;
    order_by?: string;
    projectId: number;
  }): Promise<PersistTaskEntity[]>;
  getTaskInfo(taskId: number): Promise<PersistTaskEntity>;
  update(entity: PersistTaskEntity): Promise<PersistTaskEntity>;
  delete(taskId: number): Promise<void>;
}
