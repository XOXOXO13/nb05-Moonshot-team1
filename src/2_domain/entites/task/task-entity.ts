import { User } from "@prisma/client";
import { TaskReqDto } from "../../../1_inbound/requests/task-req-dto";
import { TaskResDto } from "../../../1_inbound/responses/task-res-dto";
import { TagEntity } from "../tag/tag-entity";
import { UserEntity } from "../user/user-entity";
import { AttachmentEntity } from "../attachment/attachment-entity";

export class PersistTaskEntity {
  private readonly _id: number;
  private readonly _projectId: number;
  private readonly _title: string;
  private readonly _startDate: Date | null;
  private readonly _endDate: Date | null;
  private readonly _status: string;
  private readonly _assignee: UserEntity | null;
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
    assignee: UserEntity | null;
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

export class TaskEntity {
  private readonly _projectId: number;
  private readonly _title: string;
  private readonly _startDate?: Date | null;
  private readonly _endDate?: Date | null;
  private readonly _status: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;
  private readonly _attachments: string[];
  private readonly _assigneeId: number | null;
  private readonly _tags: string[];

  constructor(data: TaskReqDto) {
    this._projectId = data.params.projectId;
    this._title = data.body.title;

    this._startDate = new Date(
      Date.UTC(
        data.body.startYear,
        data.body.startMonth - 1,
        data.body.startDay,
      ),
    );

    this._endDate = new Date(
      Date.UTC(data.body.endYear, data.body.endMonth - 1, data.body.endDay),
    );

    this._status = data.body.status;
    this._attachments = data.body.attachments;
    this._assigneeId = data.body.assigneeId;
    this._tags = data.body.tags;
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

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get attachments() {
    return this._attachments;
  }

  // get assigneeId() {
  //   return this._assigneeId;
  // }

  get tags() {
    return this._tags;
  }
}
