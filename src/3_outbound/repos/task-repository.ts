import { PrismaClient } from "@prisma/client";
import { ITaskRepository } from "../../2_domain/ports/repositories/I-task-repository";
import {
  ModifyTaskEntity,
  CreateTaskEntity,
} from "../../2_domain/entites/task/task-entity";
import { UserEntity } from "../../2_domain/entites/user/user-entity";
import { TagEntity } from "../../2_domain/entites/tag/tag-entity";
import { AttachmentEntity } from "../../2_domain/entites/attachment/attachment-entity";
import { ProjectTaskReqDto } from "../../1_inbound/requests/task-req-dto";
import { TaskMapper } from "../mappers/task-mapper";
import { TaskResDto } from "../../1_inbound/responses/task-res-dto";
import { PersistTaskEntity } from "../../2_domain/entites/task/persist-task-entity";
import {
  ViewProjectTaskEntity,
  ViewTaskEntity,
} from "../../2_domain/entites/task/view-task-entity";

export class TaskRepository implements ITaskRepository {
  private _prisma;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async create(entity: CreateTaskEntity): Promise<PersistTaskEntity> {
    // [Transaction으로 Inconsistent Read 방지]
    // [태그와 첨부파일 생성할때 deadlock 발생 안함 (for루프 => createMany 수정함)]
    const taskRecord = await this._prisma.$transaction(async (tx) => {
      // 할일 생성하기
      const newTaskRecord = await tx.task.create({
        data: {
          projectId: entity.projectId,
          title: entity.title,
          startDate: entity.startDate,
          endDate: entity.endDate,
          status: entity.status,
          assigneeId: 1,
        },
      });

      // 태그 생성하기
      await tx.tag.createMany({
        data: entity.tags.map((tag) => {
          return {
            taskId: newTaskRecord.id,
            name: tag,
          };
        }),
      });

      // 첨부파일 추가하기
      await tx.attachment.createMany({
        data: entity.attachments.map((attachment) => {
          return {
            taskId: newTaskRecord.id,
            attachmentUrl: attachment,
          };
        }),
      });

      // 등록된 할일 조회 (태그 + 첨부파일 포함)
      const createdTask = await tx.task.findUnique({
        where: {
          id: newTaskRecord.id,
        },
        include: {
          assignee: true,
          tags: true,
          attachments: true,
        },
      });

      return createdTask;
    });

    if (!taskRecord) {
      throw new Error("Failed to create task");
    }

    const taskEntity = TaskMapper.toPersistEntity(taskRecord);
    return taskEntity;
  }

  async getProjectTasks(
    entity: ViewProjectTaskEntity,
  ): Promise<PersistTaskEntity[]> {
    const records = await this._prisma.task.findMany({
      where: {
        projectId: entity.projectId,
      },
      include: {
        assignee: true,
        tags: true,
        attachments: true,
      },
    });

    const taskEntity = records.map((record) => {
      return TaskMapper.toPersistEntity(record);
    });

    return taskEntity;
  }

  async getTaskInfo(entity: ViewTaskEntity): Promise<PersistTaskEntity> {
    const record = await this._prisma.task.findUnique({
      where: {
        id: entity.taskId,
      },
      include: {
        assignee: true,
        tags: true,
        attachments: true,
      },
    });

    if (!record) {
      throw new Error("할일이 존재하지 않습니다");
    }
    const taskEntity = TaskMapper.toPersistEntity(record);

    return taskEntity;
  }

  async update(entity: ModifyTaskEntity): Promise<PersistTaskEntity> {
    // [Transaction으로 Inconsistent Read 방지]
    // [태그와 첨부파일 생성할때 deadlock 발생 안함 (for루프 => createMany 수정함)]
    const taskRecord = await this._prisma.$transaction(async (tx) => {
      // 할일 생성하기
      const newTaskRecord = await tx.task.update({
        where: {
          id: entity.taskId,
        },
        data: {
          projectId: entity.projectId,
          title: entity.title,
          startDate: entity.startDate,
          endDate: entity.endDate,
          status: entity.status,
          assigneeId: 1,
        },
      });

      // 태그 삭제한 후 다시 생성하기
      await tx.tag.deleteMany({
        where: { taskId: entity.taskId },
      });

      await tx.tag.createMany({
        data: entity.tags.map((tag) => {
          return {
            taskId: newTaskRecord.id,
            name: tag,
          };
        }),
      });

      // 첨부파일 삭제한 후 추가하기
      await tx.attachment.deleteMany({
        where: { taskId: entity.taskId },
      });
      await tx.attachment.createMany({
        data: entity.attachments.map((attachment) => {
          return {
            taskId: newTaskRecord.id,
            attachmentUrl: attachment,
          };
        }),
      });

      // 등록된 할일 조회 (태그 + 첨부파일 포함)
      const createdTask = await tx.task.findUnique({
        where: {
          id: newTaskRecord.id,
        },
        include: {
          assignee: true,
          tags: true,
          attachments: true,
        },
      });

      return createdTask;
    });

    if (!taskRecord) {
      throw new Error("Failed to create task");
    }

    const taskEntity = TaskMapper.toPersistEntity(taskRecord);
    return taskEntity;
  }

  async delete(entity: ViewProjectTaskEntity): Promise<void> {
    await this._prisma.task.delete({
      where: { id: entity.taskId },
    });
  }
}
