import { TaskResDto, TaskResDtos } from "../../inbound/responses/task-res-dto";
import { AttachmentEntity } from "../../domain/entites/attachment/attachment-entity";
import { TagEntity } from "../../domain/entites/tag/tag-entity";

import { UserEntity } from "../../domain/entites/user/user-entity";
import { Request } from "express";
import { z } from "zod";
import { PersistTaskEntity } from "../../domain/entites/task/persist-task-entity";


export class TaskMapper {
  static toReqDto<T extends z.ZodTypeAny>(schema: T, req: Request) {
    const reqData = schema.safeParse({
      body: req.body,
      params: req.params,
      headers: req.headers,
    });

    if (!reqData.success) {
      throw new Error("잘못된 요청 형식입니다.");
    }

    return reqData.data;
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
      };
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
    },
  ) {
    return new PersistTaskEntity({
      id: record.id,
      projectId: record.projectId,
      title: record.title,
      startDate: record.startDate,
      endDate: record.endDate,
      status: record.status,
      assignee: new UserEntity({
        id: record.assignee.id,
        name: record.assignee.name,
        email: record.assignee.email,
        profileImageUrl: record.assignee.profileImage ?? undefined,
        version: record.assignee.version
      }),
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
      entity.updatedAt,
    );
  }

  static toResDtos(entities: PersistTaskEntity[]): TaskResDtos {
    const taskResDto = entities.map((entity) => {
      return TaskMapper.toResDto(entity);
    });
    const taskResDtos = new TaskResDtos(taskResDto);
    return taskResDtos;
  }
}
