import { ITaskRepository } from "../../domain/ports/repositories/I-task-repository";
import { BasePrismaClient } from "./base-repository";
import {
  NewTaskEntity,
  PersistTaskEntity,
} from "../../domain/entities/task/task-entity";
import { TaskMapper } from "../mappers/task-mapper";
import { Prisma } from "@prisma/client";
import {
  TechnicalException,
  TechnicalExceptionType,
} from "../../shared/exceptions/technical.exception";

const orderByParser = {
  created_at: "createdAt",
  title: "title",
  end_date: "endDate",
};

export class TaskRepository implements ITaskRepository {
  private _prisma;

  constructor(prisma: BasePrismaClient) {
    this._prisma = prisma;
  }

  async create(entity: NewTaskEntity): Promise<PersistTaskEntity> {
    const { createTaskData, attachmentData, taskTagsData } =
      TaskMapper.toCreateData(entity);

    // 할 일, 첨부파일, 태그 데이터 추가
    const newTaskRecord = await this._prisma.task.create({
      data: {
        ...createTaskData, // 할 일 생성
        attachments: {
          create: attachmentData, // 첨부 파일 추가
        },
        taskTags: {
          create: taskTagsData.map((t) => ({
            tag: { connect: { id: t.tagId } }, // 할 일에 태그 추가
          })),
        },
      },
      include: {
        attachments: true,
        taskTags: {
          include: { tag: true },
        },
        assignee: true,
      },
    });

    return TaskMapper.toPersistEntity(newTaskRecord);
  }

  async getProjectTasks(params: {
    page: number;
    limit: number;
    status: string;
    assignee: number;
    keyword: string;
    order: string;
    order_by: "created_at" | "end_date" | "title";
    projectId: number;
  }): Promise<PersistTaskEntity[]> {
    const taskRecords = await this._prisma.task.findMany({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      where: {
        projectId: params.projectId,
        title: {
          contains: params.keyword,
        },
        status: params.status,
        assigneeId: params.assignee,
      },

      orderBy: {
        [orderByParser[params.order_by]]: params.order,
      },

      include: {
        attachments: true,
        taskTags: {
          include: { tag: true },
        },
        assignee: true,
      },
    });

    // 파싱 및 task entity 반환
    return taskRecords.map((record) => {
      return TaskMapper.toPersistEntity(record);
    });
  }

  async getTaskInfo(taskId: number): Promise<PersistTaskEntity | null> {
    const record = await this._prisma.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        attachments: true,
        taskTags: {
          include: { tag: true },
        },
        assignee: true,
      },
    });

    return record ? TaskMapper.toPersistEntity(record) : null;
  }

  async update(entity: PersistTaskEntity): Promise<PersistTaskEntity> {
    try {
      // 기존 태그 삭제한 후 새로운 태그 추가
      await this._prisma.taskTags.deleteMany({
        where: { taskId: entity.id },
      });
      await this._prisma.taskTags.createMany({
        data: entity.taskTags.map((tasktag) => ({
          taskId: entity.id,
          tagId: tasktag.tagId,
        })),
        skipDuplicates: true,
      });

      // 기존 첨부파일 삭제한 후 새로운 파일 추가
      await this._prisma.attachment.deleteMany({
        where: { taskId: entity.id },
      });
      await this._prisma.attachment.createMany({
        data: entity.attachments.map((attachment) => ({
          taskId: entity.id,
          attachmentUrl: attachment.attachmentUrl,
        })),
        skipDuplicates: true,
      });

      // 할 일 수정하기
      const updatedTask = await this._prisma.task.update({
        where: {
          id: entity.id,
          version: entity.version,
        },
        data: {
          version: { increment: 1 },
          projectId: entity.projectId,
          title: entity.title,
          description: entity.description,
          startDate: entity.startDate,
          endDate: entity.endDate,
          status: entity.status,
          assigneeId: entity.assigneeId,
        },
        include: {
          attachments: true,
          taskTags: {
            include: { tag: true },
          },
          assignee: true,
        },
      });

      return TaskMapper.toPersistEntity(updatedTask);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025" // (버전이 불일치로) 할 일을 업데이트 할 수 없을때
      ) {
        throw new TechnicalException({
          type: TechnicalExceptionType.OPTIMISTIC_LOCK_FAILED,
          error: err,
        });
      } else {
        console.log("!!! DB에서 오류 발생했습니다");
        console.log(err);
        throw err;
      }
    }
  }

  async delete(taskId: number): Promise<void> {
    await this._prisma.task.delete({
      where: { id: taskId },
    });
  }
}
