import { User } from "@prisma/client";
import { TaskReqDto } from "../../../1_inbound/requests/task-req-dto";
import { TaskResDto } from "../../../1_inbound/responses/task-res-dto";
import { TagEntity } from "../tag/tag-entity";
import { UserEntity } from "../user/user-entity";
import { AttachmentEntity } from "../attachment/attachment-entity";
import { stat } from "fs";

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
  private readonly _taskId: number;
  private readonly _projectId: number;
  private readonly _title: string;
  private readonly _startDate: Date | null;
  private readonly _endDate: Date | null;
  private readonly _status: string;
  private readonly _attachments: string[];
  private readonly _assigneeId: number | null;
  private readonly _tags: string[];

  constructor(params: {
    taskId: number,
    projectId: number,
    title: string,
    startYear: number,
    startMonth: number,
    startDay: number,
    endYear: number,
    endMonth: number,
    endDay: number,
    status: string,
    attachments: string[],
    assigneeId: number | null,
    tags: string[],
  }) {
    this._taskId = params.taskId;
    this._projectId = params.projectId;
    this._title = params.title;

    this._startDate = new Date(Date.UTC(params.startYear, params.startMonth - 1, params.startDay));

    this._endDate = new Date(Date.UTC(params.endYear, params.endMonth - 1, params.endDay));

    this._status = params.status;
    this._attachments = params.attachments;
    this._assigneeId = params.assigneeId;
    this._tags = params.tags;
  }
  get taskId() {
    return this._taskId;
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

  get attachments() {
    return this._attachments;
  }

  get assigneeId() {
    return this._assigneeId;
  }

  get tags() {
    return this._tags;
  }
}

export class ViewProjectTaskEntity {
  private readonly _projectId: number;
  private readonly _page?: number;
  private readonly _limit?: number;
  private readonly _status?: string;
  private readonly _assignee?: number;
  private readonly _keyword?: string;
  private readonly _order?: string;
  private readonly _orderBy?: string;

  constructor(
    projectId: number,
    page: number | undefined,
    limit: number | undefined,
    status: string | undefined,
    assignee: number | undefined,
    keyword: string | undefined,
    order: string | undefined,
    orderBy: string | undefined
  ) {
    this._projectId = projectId;
    this._page = page;
    this._limit = limit;
    this._status = status;
    this._assignee = assignee;
    this._keyword = keyword;
    this._order = order;
    this._orderBy = orderBy;
  }

  get projectId() {
    return this._projectId;
  }

  get page() {
    return this._page;
  }

  get limit() {
    return this._limit;
  }

  get status() {
    return this._status;
  }

  get assignee() {
    return this._assignee;
  }

  get keyword() {
    return this._keyword;
  }

  get order() {
    return this._order;
  }

  get orderBy() {
    return this._orderBy;
  }
}



export class ViewTaskEntity {
  private readonly _userId: number;
  private readonly _taskId: number

  constructor(
    userId: number,
    taskId: number
  ) {
    this._userId = userId;
    this._taskId = taskId;
  }

  get userId() {
    return this._userId;
  }

  get taskId() {
    return this._taskId;
  }
}