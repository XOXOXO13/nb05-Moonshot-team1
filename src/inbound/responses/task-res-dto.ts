import { UserEntity } from "../../domain/entites/user/user-entity";
import { TagEntity } from "../../domain/entites/tag/tag-entity";
import { AttachmentEntity } from "../../domain/entites/attachment/attachment-entity";
import { PersistTaskEntity } from "../../domain/entites/task/task-entity";

export class TaskResDto {
  private readonly id: number;
  private readonly projectId: number;
  private readonly title: string;
  private readonly startYear: number | undefined;
  private readonly startMonth: number | undefined;
  private readonly startDay: number | undefined;
  private readonly endYear: number | undefined;
  private readonly endMonth: number | undefined;
  private readonly endDay: number | undefined;
  private readonly status: string;
  private readonly assignee: UserEntity | null;
  private readonly attachments: AttachmentEntity[] | undefined;
  private readonly tags: TagEntity[] | undefined;
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  constructor(
    id: number,
    projectId: number,
    title: string,
    startDate: Date | null,
    endDate: Date | null,
    status: string,
    assignee: UserEntity | null,
    attachments: AttachmentEntity[] | undefined,
    tags: TagEntity[] | undefined,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.title = title;
    if (startDate) {
      this.startYear = startDate.getFullYear();
      this.startMonth = startDate.getMonth() + 1;
      this.startDay = startDate.getDate();
    }

    if (endDate) {
      this.endYear = endDate.getFullYear();
      this.endMonth = endDate.getMonth() + 1;
      this.endDay = endDate.getDate();
    }

    this.status = status;
    this.assignee = assignee;
    this.tags = tags;
    this.attachments = attachments;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
