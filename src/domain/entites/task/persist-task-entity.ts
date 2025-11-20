import { AttachmentEntity } from "../attachment/attachment-entity";
import { TagEntity } from "../tag/tag-entity";
import { UserEntity } from "../user/user-entity";

export class PersistTaskEntity {
  private readonly _id: number;
  private readonly _projectId: number;
  private readonly _title: string;
  private readonly _startDate: Date | null;
  private readonly _endDate: Date | null;
  private readonly _status: string;
  private readonly _assignee: UserEntity;
  private readonly _tags: TagEntity[];
  private readonly _attachments: AttachmentEntity[];
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date;

  constructor(data: {
    id: number;
    projectId: number;
    title: string;
    startDate: Date | null;
    endDate: Date | null;
    status: string;
    assignee: UserEntity;
    tags: TagEntity[];
    attachments: AttachmentEntity[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this._id = data.id;
    this._projectId = data.projectId;
    this._title = data.title;
    this._startDate = data.startDate;
    this._endDate = data.endDate;
    this._status = data.status;
    this._assignee = data.assignee;
    this._tags = data.tags;
    this._attachments = data.attachments;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
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

  get assignee() {
    return this._assignee;
  }

  get tags() {
    return this._tags;
  }

  get attachments() {
    return this._attachments;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }
}
