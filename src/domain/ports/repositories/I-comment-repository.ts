import {
  NewCommentEntity,
  PersistCommentEntity,
} from "../../entities/comment/comment-entity";

export interface ICommentRepository {
  create(
    taskId: number,
    userId: number,
    content: string,
  ): Promise<PersistCommentEntity>;

  // findTaskProjectId(
  //   taskId: number,
  // ): Promise<PersistCommentEntity | null>

  // 조회, 수정, 삭제 메서드
  findCommentsByTask(
    taskId: number,
    page?: number,
    limit?: number,
  ): Promise<PersistCommentEntity[]>;

  findById(commentId: number): Promise<PersistCommentEntity | null>;
  update(commentId: number, content: string): Promise<PersistCommentEntity>;
  delete(commentId: number): Promise<void>;
}
