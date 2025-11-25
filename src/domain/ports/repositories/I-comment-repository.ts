import { PersistCommentEntity } from "../../entites/comment/comment-entity";

export interface ICommentRepository {
  create(
    taskId: number,
    userId: number,
    content: string,
  ): Promise<PersistCommentEntity>;

  findTaskProjectId(
    taskId: number,
  ): Promise<{ id: number; projectId: number } | null>;

  isUserProjectMember(userId: number, projectId: number): Promise<boolean>;

  findUserPublicInfo(userId: number): Promise<{
    id: number;
    name: string;
    email: string;
    profileImageUrl?: string | null;
  } | null>;

  // 목록 조회(페이지네이션)
  listComments(
    taskId: number,
    page?: number,
    limit?: number,
  ): Promise<{ data: PersistCommentEntity[]; total: number }>;

  // 아이디 확인
  findById(commentId: string): Promise<PersistCommentEntity | null>;

  // 작성자 확인
  findCommentAuthorId(commentId: string): Promise<number | null>;

  // 수정
  updateContent(
    commentId: string,
    content: string,
  ): Promise<PersistCommentEntity>;

  // 삭제
  delete(commentId: string): Promise<void>;
}
