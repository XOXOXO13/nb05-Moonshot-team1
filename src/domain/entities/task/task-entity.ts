import { PersistTagEntity } from "../tag/tag-entity";
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
  private _version: number;
  private _title: string;
  private _description: string;
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
    version: number;
    projectId: number;
    title: string;
    description: string;
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
    this._version = params.version;
    this._projectId = params.projectId;
    this._title = params.title;
    this._description = params.description;
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
    description: string;
    startDate: Date;
    endDate: Date;
    status: string;
    attachments: AttachmentEntity[];
    taskTags: TaskTagVo[];
    assigneeId: number;
  }) {
    return new TaskEntity({
      version: 1,
      projectId: params.projectId,
      title: params.title,
      description: params.description,
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
    version: number;
    projectId: number;
    title: string;
    description: string;
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
      version: params.version,
      projectId: params.projectId,
      title: params.title,
      description: params.description,
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
    title?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    status?: string;
    attachments?: AttachmentEntity[];
    taskTags?: PersistTagEntity[];
  }) {
    if (params.title !== undefined) this._title = params.title;
    if (params.description !== undefined)
      this._description = params.description;
    if (params.startDate !== undefined) this._startDate = params.startDate;
    if (params.endDate !== undefined) this._endDate = params.endDate;
    if (params.status !== undefined) this._status = params.status;
    if (params.attachments !== undefined)
      this._attachments = params.attachments;
    if (params.taskTags !== undefined)
      this._taskTags = params.taskTags.map((tag) => {
        return TaskTagVo.createNew(tag);
      });
  }

  get id() {
    return this._id;
  }

  get version() {
    return this._version;
  }

  get projectId() {
    return this._projectId;
  }

  get title() {
    return this._title;
  }

  get description() {
    return this._description;
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

  get taskTags() {
    return this._taskTags;
  }

  get assignee() {
    return this._assignee;
  }
}
