import {
  NewCommentEntity,
  PersistCommentEntity,
} from "../../domain/entities/comment/comment-entity";
import { ICommentRepository } from "../../domain/ports/repositories/I-comment-repository";
import { CommentMapper } from "../mappers/comment-mapper";
import { BasePrismaClient } from "./base-repository";

export class CommentRepository implements ICommentRepository {
  private prisma: BasePrismaClient;

  constructor(prisma: BasePrismaClient) {
    this.prisma = prisma;
  }

  async create(
    taskId: number,
    userId: number,
    content: string,
  ): Promise<PersistCommentEntity> {
    const comment = await this.prisma.comment.create({
      data: {
        taskId,
        content,
        userId
      },
      include: {
        user: true
      }
    });

    return CommentMapper.toPersistComment(comment);
  }

  // async findTaskProjectId(
  //   taskId: number,
  // ): Promise<PersistCommentEntity | null> {
  //   const comment = await this.prisma.comment.findFirst({
  //     where: {
  //       taskId
  //     },
  //     include: {
  //       user: true
  //     }
  //   });

  //   return comment ? CommentMapper.toPersistComment(comment) : null;
  // }



  // 조회, 수정, 삭제 메서드
  async findCommentsByTask(
    taskId: number,
    page?: number,
    limit?: number,
  ): Promise<PersistCommentEntity[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        taskId
      },
      include: {
        user: true
      }
    });

    return comments.map((comment) => {
      return CommentMapper.toPersistComment(comment)
    });
  }

  async findById(commentId: number): Promise<PersistCommentEntity | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId
      },
      include: {
        user: true
      }
    });

    if (!comment) {
      throw new Error("댓글이 존재하지 않습니다");
    }

    return CommentMapper.toPersistComment(comment);
  }

  async update(commentId: number, content: string): Promise<PersistCommentEntity> {
    const comment = await this.prisma.comment.update({
      where: {
        id: commentId
      },
      data: {
        content
      },
      include: {
        user: true
      }
    });

    return CommentMapper.toPersistComment(comment);
  }


  async delete(commentId: number): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: commentId
      }
    });
  }
}
