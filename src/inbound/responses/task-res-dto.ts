import { UserEntity } from "../../domain/entites/user/user-entity";
import { TagEntity } from "../../domain/entites/tag/tag-entity";
import { AttachmentEntity, PersistAttachmentEntity } from "../../domain/entites/task/attachment-entity";
import { TaskTagVo } from "../../domain/entites/task/task-tag-entity";
import { AttachmentDto } from "./attachment-dto";
import { UserDto } from "./user-dto";

export class TaskResDto {
  private readonly id: number;
  private readonly projectId: number;
  private readonly title: string;
  private readonly startYear: number;
  private readonly startMonth: number;
  private readonly startDay: number;
  private readonly endYear: number;
  private readonly endMonth: number;
  private readonly endDay: number;
  private readonly status: string;
  private readonly assignee: UserDto;
  private readonly attachments: AttachmentDto[];
  private readonly tags: TaskTagVo[];
  private readonly createdAt: Date;
  private readonly updatedAt: Date;

  constructor(
    id: number,
    projectId: number,
    title: string,
    startDate: Date,
    endDate: Date,
    status: string,
    assignee: UserEntity,
    attachments: PersistAttachmentEntity[],
    tags: TaskTagVo[],
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.projectId = projectId;
    this.title = title;

    this.startYear = startDate.getFullYear();
    this.startMonth = startDate.getMonth() + 1;
    this.startDay = startDate.getDate();


    this.endYear = endDate.getFullYear();
    this.endMonth = endDate.getMonth() + 1;
    this.endDay = endDate.getDate();


    this.status = status;
    this.assignee = new UserDto({
      id: assignee.id,
      name: assignee.name,
      email: assignee.email,
      profileImage: assignee.profileImageUrl
    });
    this.tags = tags;
    this.attachments = attachments.map((attachment) => {
      return new AttachmentDto({
        id: attachment.id,
        attachmentUrl: attachment.attachmentUrl
      })
    });
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class TaskResDtos {
  private readonly data: TaskResDto[];
  private readonly total: number;

  constructor(data: TaskResDto[]) {
    this.data = data;
    this.total = data.length;
  }
}
