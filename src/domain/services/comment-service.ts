import { ICommentRepository } from "../ports/repositories/I-comment-repository";
import { PersistCommentEntity } from "../entities/comment/comment-entity";

export class CommentService {
  constructor(private repo: ICommentRepository) {}
  // 댓글 추가
  async createComment(params: {
    taskId: number;
    userId: number;
    content: string;
  }) {
    const { taskId, userId, content } = params;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    const task = await this.repo.findTaskProjectId(taskId);
    if (!task) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    const isMember = await this.repo.isUserProjectMember(userId, task.projectId);
    if (!isMember) {
      const err: any = new Error("프로젝트 멤버가 아닙니다");
      err.status = 403;
      throw err;
    }

    const created = await this.repo.create(taskId, userId, content.trim());

    const author = await this.repo.findUserPublicInfo(userId);
    if (!author) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    return {
      id: created.id,
      content: created.content,
      taskId: created.taskId,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        profileImage: author.profileImageUrl ?? null,
      },
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };
  }

  // 목록 조회
  async listComments(params: { taskId: number; userId: number; page?: number; limit?: number }) {
    const { taskId, userId, page = 1, limit = 20 } = params;

    const task = await this.repo.findTaskProjectId(taskId);
    if (!task) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    const isMember = await this.repo.isUserProjectMember(userId, task.projectId);
    if (!isMember) {
      const err: any = new Error("프로젝트 멤버가 아닙니다");
      err.status = 403;
      throw err;
    }

    const [comments, total] = await Promise.all([
      this.repo.findCommentsByTask(taskId, page, limit),
      this.repo.countCommentsByTask(taskId),
    ]);

    // 작성자 정보 조회
    const result = await Promise.all(
      comments.map(async (c) => {
        const author = await this.repo.findUserPublicInfo(c.userId);
        return {
          id: c.id,
          content: c.content,
          taskId: c.taskId,
          author: author
            ? {
                id: author.id,
                name: author.name,
                email: author.email,
                profileImage: author.profileImageUrl ?? null,
              }
            : null,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        };
      }),
    );

    return {
      data: result,
      total,
    };
  }

  // 댓글 조회
  async getComment(params: { commentId: string; userId: number }) {
    const { commentId, userId } = params;
    const found = await this.repo.findById(commentId);
    if (!found) {
      const err: any = new Error("Not found");
      err.status = 404;
      throw err;
    }

    // 권한 체크
    const task = await this.repo.findTaskProjectId(found.taskId);
    if (!task) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }
    const isMember = await this.repo.isUserProjectMember(userId, task.projectId);
    if (!isMember) {
      const err: any = new Error("프로젝트 멤버가 아닙니다");
      err.status = 403;
      throw err;
    }

    const author = await this.repo.findUserPublicInfo(found.userId);
    if (!author) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    return {
      id: found.id,
      content: found.content,
      taskId: found.taskId,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        profileImage: author.profileImageUrl ?? null,
      },
      createdAt: found.createdAt.toISOString(),
      updatedAt: found.updatedAt.toISOString(),
    };
  }

  // 수정
  async updateComment(params: { commentId: string; userId: number; content: string }) {
    const { commentId, userId, content } = params;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    const found = await this.repo.findById(commentId);
    if (!found) {
      const err: any = new Error("Not found");
      err.status = 404;
      throw err;
    }

    // 프로젝트 멤버 여부 체크
    const task = await this.repo.findTaskProjectId(found.taskId);
    if (!task) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }
    const isMember = await this.repo.isUserProjectMember(userId, task.projectId);
    if (!isMember) {
      const err: any = new Error("프로젝트 멤버가 아닙니다");
      err.status = 403;
      throw err;
    }

    if (found.userId !== userId) {
      const err: any = new Error("자신이 작성한 댓글만 수정할 수 있습니다");
      err.status = 403;
      throw err;
    }

    const updated = await this.repo.update(commentId, content.trim());
    const author = await this.repo.findUserPublicInfo(updated.userId);
    if (!author) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    return {
      id: updated.id,
      content: updated.content,
      taskId: updated.taskId,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        profileImage: author.profileImageUrl ?? null,
      },
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  // 삭제
  async deleteComment(params: { commentId: string; userId: number }) {
    const { commentId, userId } = params;
    const found = await this.repo.findById(commentId);
    if (!found) {
      const err: any = new Error("Not found");
      err.status = 404;
      throw err;
    }

    const task = await this.repo.findTaskProjectId(found.taskId);
    if (!task) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    const isMember = await this.repo.isUserProjectMember(userId, task.projectId);
    if (!isMember) {
      const err: any = new Error("프로젝트 멤버가 아닙니다");
      err.status = 403;
      throw err;
    }

    if (found.userId !== userId) {
      const err: any = new Error("자신이 작성한 댓글만 삭제할 수 있습니다");
      err.status = 403;
      throw err;
    }

    await this.repo.delete(commentId);
    return;
  }
}