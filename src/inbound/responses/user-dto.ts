export interface UserBasicDto {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;
}

export class UserDto implements UserBasicDto {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;

  constructor(data: UserBasicDto) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.profileImage = data.profileImage;
  }
}

export interface IdNameDto {
  id: number;
  name: string;
}

export interface UserTaskTagDto extends IdNameDto {}

export interface FileDto {
  id: number;
  url: string;
}

export interface UserTaskAttachmentDto extends FileDto {}

export type TaskStatus = "todo" | "in_progress" | "done";

export interface GetUserTasksResDto {
  id: number;
  projectId: number;
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  status: TaskStatus;
  assignee: UserBasicDto | null;
  tags: IdNameDto[];
  attachments: FileDto[];
  createdAt: Date;
  updatedAt: Date;
}
