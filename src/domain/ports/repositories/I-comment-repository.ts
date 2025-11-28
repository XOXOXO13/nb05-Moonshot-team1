import { NewCommentEntity, PersistCommentEntity } from "../../entities/comment/comment-entity";

export interface ICommentRepository {
  create(taskId: number, userId: number, content: string): Promise<PersistCommentEntity>;
  findTaskProjectId(taskId: number): Promise<{ id: number; projectId: number } | null>;
  isUserProjectMember(userId: number, projectId: number): Promise<boolean>;
  findUserPublicInfo(userId: number): Promise<{
    id: number;
    name: string;
    email: string;
    profileImageUrl?: string | null;
  } | null>;

  // 조회, 수정, 삭제 메서드
  findCommentsByTask(taskId: number, page?: number, limit?: number): Promise<PersistCommentEntity[]>;
  countCommentsByTask(taskId: number): Promise<number>;
  findById(commentId: string): Promise<PersistCommentEntity | null>;
  update(commentId: string, content: string): Promise<PersistCommentEntity>;
  delete(commentId: string): Promise<void>;
}