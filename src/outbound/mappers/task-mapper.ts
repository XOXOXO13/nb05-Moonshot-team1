import {
  createTaskReqSchema,
  TaskReqDto,
} from "../../inbound/requests/task-req-dto";
import { TaskResDto } from "../../inbound/responses/task-res-dto";
import { AttachmentEntity } from "../../domain/entites/attachment/attachment-entity";
import { TagEntity } from "../../domain/entites/tag/tag-entity";
import {
  PersistTaskEntity,
  TaskEntity,
} from "../../domain/entites/task/task-entity";
import { UserEntity } from "../../domain/entites/user/user-entity";
import { Request } from "express";

export class TaskMapper {
  static toReqDto(req: Request) {
    const reqData = createTaskReqSchema.safeParse({
      body: req.body,
      params: req.params,
      headers: req.headers,
    });

    if (!reqData.success) {
      throw new Error("잘못된 요청 형식입니다.");
    }

    return reqData.data;
  }

  static toEntity(dto: TaskReqDto) {
    return new TaskEntity(
      dto.params.projectId,
      dto.body.title,
      dto.body.startYear,
      dto.body.startMonth,
      dto.body.startDay,
      dto.body.endYear,
      dto.body.endMonth,
      dto.body.endDay,
      dto.body.status,
      dto.body.attachments,
      dto.body.assigneeId,
      dto.body.tags
    );
  }

  static toPersistEntity(
    record: {
      tags: {
        id: number;
        name: string;
        taskId: number;
      }[];
      attachments: {
        id: number;
        taskId: number;
        attachmentUrl: string;
      }[];
      assignee: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        password: string | null;
        refreshToken: string | null;
        version: number;
        profileImage: string | null;
      } | null;
    } & {
      title: string;
      status: string;
      assigneeId: number | null;
      projectId: number;
      id: number;
      startDate: Date | null;
      endDate: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }
  ) {
    return new PersistTaskEntity({
      id: record.id,
      projectId: record.projectId,
      title: record.title,
      startDate: record.startDate,
      endDate: record.endDate,
      status: record.status,
      assignee: new UserEntity(record.assignee),
      tags: record.tags.map((tag) => {
        return new TagEntity(tag);
      }),
      attachments: record.attachments.map((attachment) => {
        return new AttachmentEntity(attachment);
      }),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toResDto(entity: PersistTaskEntity) {
    return new TaskResDto(
      entity.id,
      entity.projectId,
      entity.title,
      entity.startDate,
      entity.endDate,
      entity.status,
      entity.assignee,
      entity.attachments,
      entity.tags,
      entity.createdAt,
      entity.updatedAt
    );
  }
}
