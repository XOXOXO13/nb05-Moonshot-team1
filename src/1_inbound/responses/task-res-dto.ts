import { UserEntity } from "../../2_domain/entites/user/user-entity";
import { TagEntity } from "../../2_domain/entites/tag/tag-entity";
import { AttachmentEntity } from "../../2_domain/entites/attachment/attachment-entity";
import { PersistTaskEntity } from "../../2_domain/entites/task/task-entity";

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

  constructor(data: PersistTaskEntity) {
    this.id = data.id;
    this.projectId = data.projectId;
    this.title = data.title;
    if (data.startDate) {
      this.startYear = data.startDate.getFullYear();
      this.startMonth = data.startDate.getMonth() + 1;
      this.startDay = data.startDate.getDate();
    }

    if (data.endDate) {
      this.endYear = data.endDate.getFullYear();
      this.endMonth = data.endDate.getMonth() + 1;
      this.endDay = data.endDate.getDate();
    }

    this.status = data.status;
    this.assignee = data.assignee;
    this.tags = data.tags;
    this.attachments = data.attachments;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
