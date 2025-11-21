// projectTaskView
// TaskView
// Delete

import {
  ProjectTaskDto,
  TaskDto,
} from "../../../inbound/requests/task-req-dto";

export interface ViewProjectTaskEntity extends TaskQuery {
  projectId: number;
}

export interface ViewTaskInfoEntity extends TaskQuery {
  taskId: number;
}

export class TaskQuery {
  static fromProjectTaskDto(dto: ProjectTaskDto) {
    return new TaskQuery({
      userId: 1,
      projectId: dto.params.projectId,
      page: dto.query?.page,
      limit: dto.query?.limit,
      status: dto.query?.status,
      assignee: dto.query?.assignee,
      keyword: dto.query?.keyword,
      order: dto.query?.order,
      orderBy: dto.query?.order_by,
    }) as ViewProjectTaskEntity;
  }

  static fromTaskInfoDto(dto: TaskDto) {
    return new TaskQuery({
      userId: 1,
      taskId: dto.params.taskId,
    }) as ViewTaskInfoEntity;
  }
  private readonly _userId: number;
  private readonly _projectId?: number;
  private readonly _taskId?: number;
  private readonly _page?: number;
  private readonly _limit?: number;
  private readonly _status?: string;
  private readonly _assignee?: number;
  private readonly _keyword?: string;
  private readonly _order?: string;
  private readonly _orderBy?: string;

  constructor(params: {
    userId: number;
    projectId?: number;
    taskId?: number;
    page?: number;
    limit?: number;
    status?: string;
    assignee?: number;
    keyword?: string;
    order?: string;
    orderBy?: string;
  }) {
    this._userId = params.userId;
    this._projectId = params.projectId;
    this._taskId = params.taskId;
    this._page = params.page;
    this._limit = params.limit;
    this._status = params.status;
    this._assignee = params.assignee;
    this._keyword = params.keyword;
    this._order = params.order;
    this._orderBy = params.orderBy;
  }



  get userId() {
    return this._userId;
  }

  get projectId() {
    return this._projectId;
  }

  get taskId() {
    return this._taskId;
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
