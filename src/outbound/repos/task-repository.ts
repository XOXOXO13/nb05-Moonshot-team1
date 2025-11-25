import { PrismaClient } from "@prisma/client";
import { ITaskRepository } from "../../domain/ports/repositories/I-task-repository";
import { BasePrismaClient } from "./base-repository";
import { NewTaskEntity, PersistTaskEntity, TaskEntity } from "../../domain/entites/task/task-entity";
import { NewTagEntity, TagEntity } from "../../domain/entites/tag/tag-entity";
import { AttachmentEntity, NewAttachmentEntity } from "../../domain/entites/task/attachment-entity";
import { TagMapper } from "../mappers/tag-mapper";
import { TaskMapper } from "../mappers/task-mapper";
import { Console } from "console";
import { AttachmentMapper } from "../mappers/attachment-mapper";
import { TaskTagVo } from "../../domain/entites/task/task-tag-entity";

export class TaskRepository implements ITaskRepository {
  private _prisma;

  constructor(prisma: BasePrismaClient) {
    this._prisma = prisma;
  }

  async create(entity: NewTaskEntity): Promise<PersistTaskEntity> {
    const { createTaskData, attachmentData, taskTagsData }
      = TaskMapper.toCreateData(entity);

    // task, attachment, taskTags 데이터 추가
    const newTaskRecord = await this._prisma.task.create({
      data: {
        ...createTaskData,
        attachments: {
          create: attachmentData,
        },
        taskTags: {
          create: taskTagsData.map((t) => ({
            tag: { connect: { id: t.tagId } } // 이미 존재하는 tag일 경우
          })),
        },
      },
      include: {
        attachments: true,
        taskTags: {
          include: { tag: true },
        },
        assignee: true
      },
    });


    // 파싱 및 task entity 반환
    const { id, projectId, title, startDate, endDate, status, assigneeId, createdAt, updatedAt, attachments, taskTags } = newTaskRecord;

    const persistTaskProps = {
      id,
      projectId,
      title,
      startDate,
      endDate,
      status,
      assigneeId,
      createdAt,
      updatedAt,
      attachments: attachments.map(a => AttachmentEntity.createPersist({ id: a.id, attachmentUrl: a.attachmentUrl })),
      taskTags: taskTags.map(t => new TaskTagVo(t.tag.id, t.tag.name))
    };

    return TaskEntity.createPersist(persistTaskProps);

  }
}
// async getProjectTasks(
//   entity: ViewProjectTaskEntity,
// ): Promise<PersistTaskEntity[]> {
//   const records = await this._myprisma.task.findMany({
//     where: {
//       projectId: entity.projectId,
//     },
//     include: {
//       assignee: true,
//       tags: true,
//       attachments: true,
//     },
//   });

//   const taskEntity = records.map((record) => {
//     return TaskMapper.toPersistEntity(record);
//   });

//   return taskEntity;
// }

// async getTaskInfo(entity: TaskQuery): Promise<PersistTaskEntity> {
//   const record = await this._myprisma.task.findUnique({
//     where: {
//       id: entity.taskId,
//     },
//     include: {
//       assignee: true,
//       tags: true,
//       attachments: true,
//     },
//   });

//   if (!record) {
//     throw new Error("할일이 존재하지 않습니다");
//   }
//   const taskEntity = TaskMapper.toPersistEntity(record);

//   return taskEntity;
// }

// async update(entity: TaskEntity): Promise<PersistTaskEntity> {
//   // [Transaction으로 Inconsistent Read 방지]
//   // [태그와 첨부파일 생성할때 deadlock 발생 안함 (for루프 => createMany 수정함)]
//   const taskRecord = await this._myprisma.$transaction(async (tx) => {
//     // 할일 생성하기
//     const newTaskRecord = await tx.task.update({
//       where: {
//         id: entity.taskId,
//       },
//       data: {
//         projectId: entity.projectId,
//         title: entity.title,
//         startDate: entity.startDate,
//         endDate: entity.endDate,
//         status: entity.status,
//         assigneeId: 1,
//       },
//     });

//     // 태그 삭제한 후 다시 생성하기
//     await tx.tag.deleteMany({
//       where: { taskId: entity.taskId },
//     });

//     await tx.tag.createMany({
//       data: entity.tags.map((tag) => {
//         return {
//           taskId: newTaskRecord.id,
//           name: tag,
//         };
//       }),
//     });

//     // 첨부파일 삭제한 후 추가하기
//     await tx.attachment.deleteMany({
//       where: { taskId: entity.taskId },
//     });
//     await tx.attachment.createMany({
//       data: entity.attachments.map((attachment) => {
//         return {
//           taskId: newTaskRecord.id,
//           attachmentUrl: attachment,
//         };
//       }),
//     });

//     // 등록된 할일 조회 (태그 + 첨부파일 포함)
//     const createdTask = await tx.task.findUnique({
//       where: {
//         id: newTaskRecord.id,
//       },
//       include: {
//         assignee: true,
//         tags: true,
//         attachments: true,
//       },
//     });

//     return createdTask;
//   });

//   if (!taskRecord) {
//     throw new Error("Failed to create task");
//   }

//   const taskEntity = TaskMapper.toPersistEntity(taskRecord);
//   return taskEntity;
// }

// async delete(entity: ViewProjectTaskEntity): Promise<void> {
//   await this._myprisma.task.delete({
//     where: { id: entity.taskId },
//   });
// }


