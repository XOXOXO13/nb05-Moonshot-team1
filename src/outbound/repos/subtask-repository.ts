import { BasePrismaClient } from "./base-repository";
import {
  NewTaskEntity,
  PersistTaskEntity,
} from "../../domain/entities/task/task-entity";
import { TaskMapper } from "../mappers/task-mapper";
import { ISubTaskRepository } from "../../domain/ports/repositories/I-subtask-repository";
import {
  NewSubTaskEntity,
  PersistSubTaskEntity,
  UpdateSubTaskEntity,
} from "../../domain/entities/subtask/subtask-entity";
import { SubTaskMapper } from "../mappers/subtask-mapper";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  TechnicalException,
  TechnicalExceptionType,
} from "../../shared/exceptions/technical.exception";
import { Prisma } from "@prisma/client";

const orderByParser = {
  created_at: "createdAt",
  title: "title",
  end_date: "endDate",
};

export class SubTaskRepository implements ISubTaskRepository {
  private _prisma;

  constructor(prisma: BasePrismaClient) {
    this._prisma = prisma;
  }

  async create(entity: NewSubTaskEntity): Promise<PersistSubTaskEntity> {
    try {
      const newSubTaskRecord = await this._prisma.subTask.create({
        data: {
          taskId: entity.taskId,
          title: entity.title,
          status: entity.status,
        },
      });

      return SubTaskMapper.toPersistEntity(newSubTaskRecord);
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === "P2003"
      ) {
        throw new TechnicalException({
          type: TechnicalExceptionType.FOREIGN_KEY_CONSTRAINT_VIOLATED,
          error: err,
        });
      }
      throw err;
    }
  }

  async getSubTasks(params: {
    page: number;
    limit: number;
    taskId: number;
  }): Promise<PersistSubTaskEntity[]> {
    const subTaskRecords = await this._prisma.subTask.findMany({
      skip: (params.page - 1) * params.limit,
      take: params.limit,
      where: {
        taskId: params.taskId,
      },
    });

    // 파싱 및 task entity 반환
    return subTaskRecords.map((record) => {
      return SubTaskMapper.toPersistEntity(record);
    });
  }

  async getSubTaskInfo(
    subtaskId: number,
  ): Promise<PersistSubTaskEntity | null> {
    const record = await this._prisma.subTask.findUnique({
      where: {
        id: subtaskId,
      },
    });

    return record ? SubTaskMapper.toPersistEntity(record) : null;
  }

  async update(entity: UpdateSubTaskEntity): Promise<PersistSubTaskEntity> {
    try {
      const updatedSubTask = await this._prisma.subTask.update({
        where: { id: entity.subtaskId },
        data: {
          title: entity.title,
        },
      });
      return SubTaskMapper.toPersistEntity(updatedSubTask);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025" // (버전이 불일치로) 할 일을 업데이트 할 수 없을때
      ) {
        throw new TechnicalException({
          type: TechnicalExceptionType.OPTIMISTIC_LOCK_FAILED,
          error: err,
        });
      }
      throw err;
    }
  }

  async delete(subtaskId: number): Promise<void> {
    await this._prisma.subTask.delete({
      where: { id: subtaskId },
    });
  }
}
