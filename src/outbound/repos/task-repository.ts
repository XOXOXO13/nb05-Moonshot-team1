import { PrismaClient } from "@prisma/client";
import { ITaskRepository } from "../../domain/ports/repositories/I-task-repository";
import {
  PersistTaskEntity,
  TaskEntity,
} from "../../domain/entites/task/task-entity";
import { UserEntity } from "../../domain/entites/user/user-entity";
import { TagEntity } from "../../domain/entites/tag/tag-entity";
import { AttachmentEntity } from "../../domain/entites/attachment/attachment-entity";
import { TaskViewReqDto } from "../../inbound/requests/task-req-dto";
import { TaskMapper } from "../mappers/task-mapper";

export class TaskRepository implements ITaskRepository {
  private _prisma;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async create(entity: TaskEntity): Promise<PersistTaskEntity> {
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
}
