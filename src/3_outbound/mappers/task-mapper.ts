import {
  TaskReqDto,
  ProjectTaskReqDto,
  TaskInfoReqDto,
} from "../../1_inbound/requests/task-req-dto";
import { TaskResDto, TaskResDtos } from "../../1_inbound/responses/task-res-dto";
import { AttachmentEntity } from "../../2_domain/entites/attachment/attachment-entity";
import { TagEntity } from "../../2_domain/entites/tag/tag-entity";
import {
  ViewTaskEntity,
  PersistTaskEntity,
  TaskEntity,
  ViewProjectTaskEntity,
} from "../../2_domain/entites/task/task-entity";
import { UserEntity } from "../../2_domain/entites/user/user-entity";
import { Request } from "express";
import { z } from "zod"

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

  static toEntity(dto: TaskReqDto) {
    return new TaskEntity({
      taskId: dto.params.taskId,
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
    }

    );
  }

  static toViewEntity(dto: ProjectTaskReqDto) {
    return new ViewProjectTaskEntity(
      dto.params.projectId,
      dto.query?.page,
      dto.query?.limit,
      dto.query?.status,
      dto.query?.assignee,
      dto.query?.keyword,
      dto.query?.order,
      dto.query?.order_by
    )
  }

  static toModifyTaskEntity(dto: TaskInfoReqDto) {
    return new ViewTaskEntity(
      1,
      dto.params.taskId
    )
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
    },
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
      entity.updatedAt,
    );
  }


  static toResDtos(entities: PersistTaskEntity[]): TaskResDtos {
    const taskResDto = entities.map((entity) => {
      return TaskMapper.toResDto(entity)
    })
    const taskResDtos = new TaskResDtos(taskResDto);
    return taskResDtos;
  }
}
