import {
  NewTaskEntity,
  PersistTaskEntity,
} from "../../entities/task/task-entity";

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

  getTaskInfo(taskId: number): Promise<PersistTaskEntity | null>;

  /**
   * @throws OPTIMISTIC_LOCK_FAILED
   */
  update(entity: PersistTaskEntity): Promise<PersistTaskEntity>;

  delete(taskId: number): Promise<void>;
}
