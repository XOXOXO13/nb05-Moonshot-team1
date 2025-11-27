import { NewTagEntity, PersistTagEntity } from "../../entites/tag/tag-entity";
import { NewAttachmentEntity } from "../../entites/task/attachment-entity";
import {
  NewTaskEntity,
  PersistTaskEntity,
} from "../../entites/task/task-entity";

export interface ITagRepository {
  findOrCreate(tags: NewTagEntity[]): Promise<PersistTagEntity[]>;
  // getProjectTasks(entity: ViewProjectTaskEntity): Promise<PersistTaskEntity[]>;
  // getTaskInfo(entity: TaskQuery): Promise<PersistTaskEntity>;
  // update(entity: TaskEntity): Promise<PersistTaskEntity>;
  // delete(entity: TaskQuery): Promise<void>;
}
