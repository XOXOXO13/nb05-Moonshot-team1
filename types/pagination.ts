import { TaskStatus } from "./TaskStatus";

export interface PaginationOption {
  page: number;
  limit: number;
  order_by?: string;
  order?: "asc" | "desc";
  keyword?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
}

export interface FindByTasksByProjectIdPaginationOption extends PaginationOption {
  order_by?: "createdAt" | "endDate" | "name";
  status?: TaskStatus;
  assignee?: number;
  fromStartDate?: Date;
  toStartDate?: Date;
}

export interface FindMyTasksQuery {
  from?: string;
  to?: string;
  project_id?: number;
  status?: "todo" | "in_progress" | "done";
  assignee_id?: number;
  keyword?: string;
}
