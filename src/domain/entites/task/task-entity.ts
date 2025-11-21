import { User } from "@prisma/client";
import { TaskResDto } from "../../../inbound/responses/task-res-dto";
import { TagEntity } from "../tag/tag-entity";
import { UserEntity } from "../user/user-entity";
import { AttachmentEntity } from "../attachment/attachment-entity";
import { stat } from "fs";
import {
  CreateTaskReqDto,
  UpdateTaskReqDto,
} from "../../../inbound/requests/task-req-dto";

export interface CreateTaskEntity extends ModifyTaskEntity {
  projectId: number;
}

export interface UpdateTaskEntity extends ModifyTaskEntity {
  taskId: number;
}

export class ModifyTaskEntity {
  private readonly _taskId?: number;
  private readonly _projectId?: number;
  private readonly _title: string;
  private readonly _startDate: Date | null;
  private readonly _endDate: Date | null;
  private readonly _status: string;
  private readonly _attachments: string[];
  private readonly _assigneeId: number | null;
  private readonly _tags: string[];

  constructor(params: {
    taskId?: number;
    projectId?: number;
    title: string;
    startYear: number;
    startMonth: number;
    startDay: number;
    endYear: number;
    endMonth: number;
    endDay: number;
    status: string;
    attachments: string[];
    assigneeId: number | null;
    tags: string[];
  }) {
    this._taskId = params.taskId;
    this._projectId = params.projectId;
    this._title = params.title;

    this._startDate = new Date(
      Date.UTC(params.startYear, params.startMonth - 1, params.startDay),
    );

    this._endDate = new Date(
      Date.UTC(params.endYear, params.endMonth - 1, params.endDay),
    );

    this._status = params.status;
    this._attachments = params.attachments;
    this._assigneeId = params.assigneeId;
    this._tags = params.tags;
  }

  static toCreateTaskEntity(dto: CreateTaskReqDto) {
    return new ModifyTaskEntity({
      projectId: dto.params.projectId,
      title: dto.body.title,
      startYear: dto.body.startYear,
      startMonth: dto.body.startMonth,
      startDay: dto.body.startDay,
      endYear: dto.body.endYear,
      endMonth: dto.body.endMonth,
      endDay: dto.body.endDay,
      status: dto.body.status,
      attachments: dto.body.attachments,
      assigneeId: dto.body.assigneeId,
      tags: dto.body.tags,
    }) as CreateTaskEntity;
  }

  static toUpdateTaskEntity(dto: UpdateTaskReqDto) {
    return new ModifyTaskEntity({
      taskId: dto.params.taskId,
      title: dto.body.title,
      startYear: dto.body.startYear,
      startMonth: dto.body.startMonth,
      startDay: dto.body.startDay,
      endYear: dto.body.endYear,
      endMonth: dto.body.endMonth,
      endDay: dto.body.endDay,
      status: dto.body.status,
      attachments: dto.body.attachments,
      assigneeId: dto.body.assigneeId,
      tags: dto.body.tags,
    }) as CreateTaskEntity;
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
