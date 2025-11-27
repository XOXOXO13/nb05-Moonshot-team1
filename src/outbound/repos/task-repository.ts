import { ITaskRepository } from "../../domain/ports/repositories/I-task-repository";
import { BasePrismaClient } from "./base-repository";
import {
  NewTaskEntity,
  PersistTaskEntity,
} from "../../domain/entities/task/task-entity";
import { TaskMapper } from "../mappers/task-mapper";

const orderByParser = {
  created_at: "createdAt",
  name: "title",
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

    // task, attachment, taskTags 데이터 추가
    const newTaskRecord = await this._prisma.task.create({
      data: {
        ...createTaskData,
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
    order_by: "created_at" | "end_date" | "name";
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

  async getTaskInfo(taskId: number): Promise<PersistTaskEntity> {
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

    if (!record) {
      throw new Error("할일이 존재하지 않습니다");
    }
    const taskEntity = TaskMapper.toPersistEntity(record);

    return taskEntity;
  }

  async update(entity: PersistTaskEntity): Promise<PersistTaskEntity> {
    // 기존 태그 삭제한 후 새로운 태그 추가

    const result = await this._prisma.taskTags.deleteMany({
      where: { taskId: entity.id },
    });

    console.log(result);

    await this._prisma.taskTags.createMany({
      data: entity.taskTags.map((tasktag) => ({
        taskId: entity.id,
        tagId: tasktag.tagId,
      })),
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
    });

    // 할 일 수정하기
    const updatedTask = await this._prisma.task.update({
      where: {
        id: entity.id,
      },
      data: {
        projectId: entity.projectId,
        title: entity.title,
        description: entity.description,
        startDate: entity.startDate,
        endDate: entity.endDate,
        status: entity.status,
        assigneeId: 1,
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
  }

  async delete(taskId: number): Promise<void> {
    await this._prisma.task.delete({
      where: { id: taskId },
    });
  }
}
