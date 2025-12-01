export interface NewSubTaskEntity extends SubTaskEntity {
  taskId: number;
}

export type UpdateSubTaskEntity = Omit<
  SubTaskEntity,
  "id" | "createdAt" | "updatedAt" | "taskId"
>;

export interface PersistSubTaskEntity extends SubTaskEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  taskId: number;
}

export class SubTaskEntity {
  private readonly _id?: number;
  private _title: string;
  private readonly _taskId?: number;
  private readonly _subtaskId?: number;
  private readonly _status: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(params: {
    id?: number;
    title: string;
    taskId?: number;
    subtaskId?: number;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = params.id;
    this._title = params.title;
    this._taskId = params.taskId;
    this._subtaskId = params.subtaskId;
    this._status = params.status;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
  }

  static createNew(params: { title: string; status: string; taskId: number }) {
    return new SubTaskEntity({
      title: params.title,
      status: params.status,
      taskId: params.taskId,
    }) as NewSubTaskEntity;
  }

  static createUpdate(params: {
    title: string;
    status: string;
    subtaskId: number;
  }) {
    return new SubTaskEntity({
      title: params.title,
      status: params.status,
      subtaskId: params.subtaskId,
    }) as UpdateSubTaskEntity;
  }

  static createPersist(params: {
    id: number;
    title: string;
    taskId: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new SubTaskEntity({
      id: params.id,
      title: params.title,
      taskId: params.taskId,
      status: params.status,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    }) as PersistSubTaskEntity;
  }

  update(params: { title?: string }) {
    if (params.title !== undefined) this._title = params.title;
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get taskId() {
    return this._taskId;
  }

  get subtaskId() {
    return this._subtaskId;
  }

  get status() {
    return this._status;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}
