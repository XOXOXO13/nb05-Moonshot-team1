import { TaskStatus } from "./TaskStatus";
import UserProjectStatus from "./UserProjectStatus";

interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  profileImage: string | null;
}

export interface UserProject extends BaseEntity {
  userId: number;
  projectId: number;
  role: string;
  user?: User;
  status: UserProjectStatus;
  invitationId: string | null;
}

export interface UserWithCounts extends User {
  taskCount: number;
  status: UserProjectStatus;
  invitationId: string | null;
}

export interface ProjectWithCounts extends Project {
  memberCount: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}

export interface Tag extends BaseEntity {
  id: number;
  name: string;
}

export interface Attachment {
  id: number;
  url: string;
}

export interface SubTask extends BaseEntity {
  title: string;
  taskId: number;
  status: TaskStatus;
}

export interface Comment extends BaseEntity {
  content: string;
  taskId: number;
  author?: User;
}

interface TaskBase extends BaseEntity {
  projectId: number;
  title: string;
  description?: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
}

export interface Project extends BaseEntity {
  id: number;
  name: string;
  description: string;
  members?: User[];
}

export interface Task extends TaskBase {
  status: TaskStatus;
  assignee: User | null;
  tags: Tag[];
  attachments?: string[];
  comments?: Comment[];
  subTasks?: SubTask[];
}

export interface TaskPayload extends TaskBase {
  status: TaskStatus;
  assigneeId: string;
  tags: string[];
  attachments?: string[];
}

export type UpdateTaskPayload = Partial<TaskPayload>;
