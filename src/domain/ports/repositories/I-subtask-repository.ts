import {
  NewSubTaskEntity,
  PersistSubTaskEntity,
  UpdateSubTaskEntity,
} from "../../entities/subtask/subtask-entity";

export interface ISubTaskRepository {
  create(entity: NewSubTaskEntity): Promise<PersistSubTaskEntity>;

  getSubTasks(params: {
    page: number;
    limit: number;
    taskId: number;
  }): Promise<PersistSubTaskEntity[]>;

  getSubTaskInfo(taskId: number): Promise<PersistSubTaskEntity | null>;

  //   /**
  //    * @throws OPTIMISTIC_LOCK_FAILED
  //    */
  update(entity: UpdateSubTaskEntity): Promise<PersistSubTaskEntity>;

  delete(subtaskId: number): Promise<void>;
}
