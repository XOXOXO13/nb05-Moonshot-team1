import { PrismaClient } from "@prisma/client";
import {
  NewCommentEntity,
  PersistCommentEntity,
} from "../../domain/entities/comment/comment-entity";
import { ICommentRepository } from "../../domain/ports/repositories/I-comment-repository";

export class CommentRepository implements ICommentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(
    taskId: number,
    userId: number,
    content: string,
  ): Promise<PersistCommentEntity> {
    const created = await this.prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
      },
    });

    return {
      id: created.id,
      content: created.content,
      taskId: created.taskId,
      userId: created.userId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  async findTaskProjectId(
    taskId: number,
  ): Promise<{ id: number; projectId: number } | null> {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      select: { id: true, projectId: true },
    });
    return task ? { id: task.id, projectId: task.projectId } : null;
  }

  async isUserProjectMember(
    userId: number,
    projectId: number,
  ): Promise<boolean> {
    const member = await this.prisma.member.findFirst({
      where: {
        userId,
        projectId,
        status: "ACTIVE",
      },
    });
    return !!member;
  }

  async findUserPublicInfo(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      profileImageUrl: user.profileImage,
    };
  }

  async findCommentsByTask(
    taskId: number,
    page: number = 1,
    limit: number = 20,
  ): Promise<PersistCommentEntity[]> {
    const skip = (page - 1) * limit;
    const records = await this.prisma.comment.findMany({
      where: { taskId },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return records.map((r) => ({
      id: r.id,
      content: r.content,
      taskId: r.taskId,
      userId: r.userId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }

  async countCommentsByTask(taskId: number): Promise<number> {
    return await this.prisma.comment.count({ where: { taskId } });
  }

  async findById(commentId: string): Promise<PersistCommentEntity | null> {
    const found = await this.prisma.comment.findUnique({
      where: { id: commentId },
      include: { user: true },
    });
    if (!found) return null;
    return {
      id: found.id,
      content: found.content,
      taskId: found.taskId,
      userId: found.userId,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    };
  }

  async update(
    commentId: string,
    content: string,
  ): Promise<PersistCommentEntity> {
    const updated = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
    return {
      id: updated.id,
      content: updated.content,
      taskId: updated.taskId,
      userId: updated.userId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async delete(commentId: string): Promise<void> {
    await this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}
