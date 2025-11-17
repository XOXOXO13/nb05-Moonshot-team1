import { PrismaClient } from "@prisma/client";
import { ITaskRepository } from "../../2_domain/ports/repositories/I-task-repository";
import {
  PersistTaskEntity,
  TaskEntity,
} from "../../2_domain/entites/task/task-entity";
import { UserEntity } from "../../2_domain/entites/user/user-entity";
import { TagEntity } from "../../2_domain/entites/tag/tag-entity";
import { AttachmentEntity } from "../../2_domain/entites/attachment/attachment-entity";

export class TaskRepository implements ITaskRepository {
  private _prisma;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  async create(entity: TaskEntity): Promise<PersistTaskEntity> {
    const tags: TagEntity[] = [];
    const attachments: AttachmentEntity[] = [];

    const taskRecords = await this._prisma.$transaction(async (tx) => {
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
      for (const tag of entity.tags) {
        const newTagRecord = await tx.tag.create({
          data: {
            taskId: newTaskRecord.id,
            name: tag,
          },
        });

        tags.push(new TagEntity(newTagRecord));
      }

      // 첨부파일 추가하기
      for (const attachment of entity.attachments) {
        const newAttachmentRecord = await tx.file.create({
          data: {
            taskId: newTaskRecord.id,
            fileUrl: attachment,
          },
        });
        attachments.push(new AttachmentEntity(newAttachmentRecord));
      }

      // Assignee 조회하기
      const assigneeRecord = await tx.user.findUnique({
        where: { id: 1 },
      });
      const assignee = assigneeRecord
        ? new UserEntity({
            ...assigneeRecord,
            profileImage: assigneeRecord.profileImageUrl ?? "",
          })
        : null;

      const responseData = {
        task: newTaskRecord,
        tags: tags,
        attachments: attachments,
        assignee: assignee,
      };

      return {
        task: newTaskRecord,
        tags: tags,
        attachments: attachments,
        assignee: assignee,
      };
    });

    const taskEntity = new PersistTaskEntity({
      id: taskRecords.task.id,
      projectId: taskRecords.task.projectId,
      title: taskRecords.task.title,
      startDate: taskRecords.task.startDate,
      endDate: taskRecords.task.endDate,
      status: taskRecords.task.status,
      assignee: taskRecords.assignee,
      tags: taskRecords.tags,
      attachments: taskRecords.attachments,
      createdAt: taskRecords.task.createdAt,
      updatedAt: taskRecords.task.updatedAt,
    });

    return taskEntity;
  }
}
