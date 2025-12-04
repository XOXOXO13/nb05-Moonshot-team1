import { en } from "zod/v4/locales";
import { AuthorVo } from "../../domain/entities/comment/author-vo";
import {
  CommentEntity,
  PersistComment,
  PersistCommentEntity,
} from "../../domain/entities/comment/comment-entity";
import { CommentResDto } from "../../inbound/responses/comment-dto";

export class CommentMapper {
  static toPersistComment(record: PersistComment) {
    return CommentEntity.createPersist({
      id: record.id,
      taskId: record.taskId,
      userId: record.userId,
      author: AuthorVo.createNew({
        id: record.user.id,
        name: record.user.name,
        email: record.user.email,
        profileImage: record.user.profileImage ?? undefined,
      }),
      content: record.content,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    }) as PersistCommentEntity;
  }

  static toResDto(entity: PersistCommentEntity) {
    return new CommentResDto({
      id: entity.id,
      content: entity.content,
      taskId: entity.taskId,
      author: entity.author,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
