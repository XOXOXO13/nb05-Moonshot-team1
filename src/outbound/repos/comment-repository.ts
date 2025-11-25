import { PrismaClient } from "@prisma/client";
import {
  PersistCommentEntity,
  NewCommentEntity,
  CommentEntity,
} from "../../domain/entites/comment/comment-entity";

export class CommentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(entity: NewCommentEntity): Promise<PersistCommentEntity> {
    const created = await this.prisma.comment.create({
      data: {
        content: entity.content,
        taskId: entity.taskId,
        userId: entity.userId,
      },
    });

    return {
      id: Number(created.id) as unknown as number,
      content: created.content,
      taskId: created.taskId,
      userId: created.userId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async findById(commentId: string): Promise<PersistCommentEntity | null> {
    const found = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!found) return null;

    return {
      id: Number(found.id) as unknown as number,
      content: found.content,
      taskId: found.taskId,
      userId: found.userId,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    };
  }

  async update(entity: CommentEntity): Promise<PersistCommentEntity> {
    const updated = await this.prisma.comment.update({
      where: { id: String(entity.id) },
      data: {
        content: entity.content,
      },
    });

    return {
      id: Number(updated.id) as unknown as number,
      content: updated.content,
      taskId: updated.taskId,
      userId: updated.userId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async delete(commentId: string | number): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: String(commentId) },
    });
  }
}