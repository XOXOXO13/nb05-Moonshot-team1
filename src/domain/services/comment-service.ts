import { ICommentRepository } from "../ports/repositories/I-comment-repository";

export class CommentService {
  constructor(private repo: ICommentRepository) {}

  async createComment(params: {
    taskId: number;
    userId: number;
    content: string;
  }) {
    const { taskId, userId, content } = params;

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
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

    const isMember = await this.repo.isUserProjectMember(
      userId,
      task.projectId,
    );
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

  async listComments(params: {
    taskId: number;
    userId: number;
    page?: number;
    limit?: number;
  }) {
    const { taskId, userId, page = 1, limit = 10 } = params;

    if (Number.isNaN(taskId) || page <= 0 || limit <= 0) {
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

    const isMember = await this.repo.isUserProjectMember(
      userId,
      task.projectId,
    );
    if (!isMember) {
      const err: any = new Error("프로젝트 멤버가 아닙니다");
      err.status = 403;
      throw err;
    }

    const { data, total } = await this.repo.listComments(taskId, page, limit);

    // author 정보 결합: 각 comment.userId에 대해 공통 조회 사용
    const results = await Promise.all(
      data.map(async (c) => {
        const author = await this.repo.findUserPublicInfo(c.userId);
        return {
          id: c.id,
          content: c.content,
          taskId: c.taskId,
          author: {
            id: author?.id ?? null,
            name: author?.name ?? null,
            email: author?.email ?? null,
            profileImage: author?.profileImageUrl ?? null,
          },
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        };
      }),
    );

    return { data: results, total };
  }

  async getComment(params: { commentId: string; userId: number }) {
    const { commentId, userId } = params;
    if (!commentId) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    const comment = await this.repo.findById(commentId);
    if (!comment) {
      const err: any = new Error("Not Found");
      err.status = 404;
      throw err;
    }

    const task = await this.repo.findTaskProjectId(comment.taskId);
    if (!task) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    const isMember = await this.repo.isUserProjectMember(
      userId,
      task.projectId,
    );
    if (!isMember) {
      const err: any = new Error("프로젝트 멤버가 아닙니다");
      err.status = 403;
      throw err;
    }

    const author = await this.repo.findUserPublicInfo(comment.userId);
    if (!author) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    return {
      id: comment.id,
      content: comment.content,
      taskId: comment.taskId,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        profileImage: author.profileImageUrl ?? null,
      },
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  }

  async updateComment(params: {
    commentId: string;
    userId: number;
    content: string;
  }) {
    const { commentId, userId, content } = params;

    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0 ||
      !commentId
    ) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    const comment = await this.repo.findById(commentId);
    if (!comment) {
      const err: any = new Error("Not Found");
      err.status = 404;
      throw err;
    }

    const task = await this.repo.findTaskProjectId(comment.taskId);
    if (!task) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }
    const isMember = await this.repo.isUserProjectMember(
      userId,
      task.projectId,
    );
    if (!isMember) {
      const err: any = new Error("프로젝트 멤버가 아닙니다");
      err.status = 403;
      throw err;
    }

    if (comment.userId !== userId) {
      const err: any = new Error("자신이 작성한 댓글만 수정할 수 있습니다");
      err.status = 403;
      throw err;
    }

    const updated = await this.repo.updateContent(commentId, content.trim());
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

  async deleteComment(params: { commentId: string; userId: number }) {
    const { commentId, userId } = params;
    if (!commentId) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }

    const comment = await this.repo.findById(commentId);
    if (!comment) {
      const err: any = new Error("Not Found");
      err.status = 404;
      throw err;
    }

    const task = await this.repo.findTaskProjectId(comment.taskId);
    if (!task) {
      const err: any = new Error("잘못된 요청 형식");
      err.status = 400;
      throw err;
    }
    const isMember = await this.repo.isUserProjectMember(
      userId,
      task.projectId,
    );
    if (!isMember) {
      const err: any = new Error("프로젝트 멤버가 아닙니다");
      err.status = 403;
      throw err;
    }

    if (comment.userId !== userId) {
      const err: any = new Error("자신이 작성한 댓글만 삭제할 수 있습니다");
      err.status = 403;
      throw err;
    }

    await this.repo.delete(commentId);
    return;
  }
}
