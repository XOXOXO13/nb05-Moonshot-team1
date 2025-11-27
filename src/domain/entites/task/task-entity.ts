import { TagEntity } from "../tag/tag-entity";
import { AttachmentEntity } from "./attachment-entity";
import { TaskTagVo } from "./task-tag-vo";
import { UserVo } from "./user-vo";

export type NewTaskEntity = Omit<
  TaskEntity,
  "id" | "createdAt" | "updatedAt" | "assignee"
>;

export interface PersistTaskEntity extends TaskEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  assignee: UserVo;
}

export class TaskEntity {
  private readonly _id?: number;
  private readonly _projectId: number;
  private _title: string;
  private _startDate: Date;
  private _endDate: Date;
  private _status: string;
  private _attachments: AttachmentEntity[];
  private _taskTags: TaskTagVo[];
  private _assigneeId: number;
  private readonly _assignee?: UserVo;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(params: {
    id?: number;
    projectId: number;
    title: string;
    startDate: Date;
    endDate: Date;
    status: string;
    attachments: AttachmentEntity[];
    taskTags: TaskTagVo[];
    assignee?: UserVo;
    assigneeId: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = params.id;
    this._projectId = params.projectId;
    this._title = params.title;
    this._startDate = params.startDate;
    this._endDate = params.endDate;
    this._status = params.status;
    this._attachments = params.attachments;
    this._taskTags = params.taskTags;
    this._assignee = params.assignee;
    this._assigneeId = params.assigneeId;
    this._createdAt = params.createdAt;
    this._updatedAt = params.updatedAt;
  }

  static createNew(params: {
    projectId: number;
    title: string;
    startDate: Date;
    endDate: Date;
    status: string;
    attachments: AttachmentEntity[];
    taskTags: TaskTagVo[];
    assigneeId: number;
  }) {
    return new TaskEntity({
      projectId: params.projectId,
      title: params.title,
      startDate: params.startDate,
      endDate: params.endDate,
      status: params.status,
      attachments: params.attachments,
      taskTags: params.taskTags,
      assigneeId: params.assigneeId,
    }) as NewTaskEntity;
  }

  static createPersist(params: {
    id: number;
    projectId: number;
    title: string;
    startDate: Date;
    endDate: Date;
    status: string;
    assignee: UserVo;
    assigneeId: number;
    attachments: AttachmentEntity[];
    taskTags: TaskTagVo[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new TaskEntity({
      id: params.id,
      projectId: params.projectId,
      title: params.title,
      startDate: params.startDate,
      endDate: params.endDate,
      status: params.status,
      attachments: params.attachments,
      taskTags: params.taskTags,
      assignee: params.assignee,
      assigneeId: params.assigneeId,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    }) as PersistTaskEntity;
  }

  update(params: {
    title: string;
    startDate: Date;
    endDate: Date;
    status: string;
    attachments: AttachmentEntity[];
    taskTags: TaskTagVo[];
    assigneeId: number;
  }) {
    this._title = params.title;
    this._startDate = params.startDate;
    this._endDate = params.endDate;
    this._status = params.status;
    this._attachments = params.attachments;
    this._taskTags = params.taskTags;
    this._assigneeId = params.assigneeId;
  }

  get id() {
    return this._id;
  }

  get projectId() {
    return this._projectId;
  }

  get title() {
    return this._title;
  }

  get startDate() {
    return this._startDate;
  }

  get endDate() {
    return this._endDate;
  }

  get status() {
    return this._status;
  }

  get assigneeId() {
    return this._assigneeId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get attachments() {
    return this._attachments;
  }

  get tasktags() {
    return this._taskTags;
  }

  get assignee() {
    return this._assignee;
  }
}
