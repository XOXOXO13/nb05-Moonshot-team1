import { Request, Response } from "express";
import { CommentService } from "../../domain/services/comment-service";

//컨트롤러
export class CommentController {
  constructor(private commentService: CommentService) {}

  createComment = async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "로그인이 필요합니다" });
    }

    const taskId = Number(req.params.taskId);
    if (Number.isNaN(taskId)) {
      return res.status(400).json({ message: "잘못된 요청 형식" });
    }

    const { content } = req.body;
    try {
      const result = await this.commentService.createComment({
        taskId,
        userId: user.userId,
        content,
      });

      return res.status(200).json(result);
    } catch (err: any) {
      if (err.status === 400)
        return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403)
        return res.status(403).json({ message: "프로젝트 멤버가 아닙니다" });
      console.error(err);
      return res.status(500).json({ message: "서버 에러" });
    }
  };

  listComments = async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "로그인이 필요합니다" });
    }

    const taskId = Number(req.params.taskId);
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    if (Number.isNaN(taskId) || Number.isNaN(page) || Number.isNaN(limit)) {
      return res.status(400).json({ message: "잘못된 요청 형식" });
    }

    try {
      const result = await this.commentService.listComments({
        taskId,
        userId: user.userId,
        page,
        limit,
      });

      return res.status(200).json(result);
    } catch (err: any) {
      if (err.status === 400)
        return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403)
        return res.status(403).json({ message: "프로젝트 멤버가 아닙니다" });
      console.error(err);
      return res.status(500).json({ message: "서버 에러" });
    }
  };

  getComment = async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "로그인이 필요합니다" });
    }

    const commentId = req.params.commentId;
    if (!commentId) {
      return res.status(400).json({ message: "잘못된 요청 형식" });
    }

    try {
      const result = await this.commentService.getComment({
        commentId,
        userId: user.userId,
      });

      return res.status(200).json(result);
    } catch (err: any) {
      if (err.status === 400)
        return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403)
        return res.status(403).json({ message: "프로젝트 멤버가 아닙니다" });
      if (err.status === 404) return res.status(404).send();
      console.error(err);
      return res.status(500).json({ message: "서버 에러" });
    }
  };

  updateComment = async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "로그인이 필요합니다" });
    }

    const commentId = req.params.commentId;
    const { content } = req.body;
    if (!commentId || !content) {
      return res.status(400).json({ message: "잘못된 요청 형식" });
    }

    try {
      const result = await this.commentService.updateComment({
        commentId,
        userId: user.userId,
        content,
      });

      return res.status(200).json(result);
    } catch (err: any) {
      if (err.status === 400)
        return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403) {
        const msg = err.message.includes("자신이 작성한 댓글")
          ? "자신이 작성한 댓글만 수정할 수 있습니다"
          : "프로젝트 멤버가 아닙니다";
        return res.status(403).json({ message: msg });
      }
      if (err.status === 404) return res.status(404).send();
      console.error(err);
      return res.status(500).json({ message: "서버 에러" });
    }
  };

  deleteComment = async (req: Request, res: Response) => {
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "로그인이 필요합니다" });
    }

    const commentId = req.params.commentId;
    if (!commentId) {
      return res.status(400).json({ message: "잘못된 요청 형식" });
    }

    try {
      await this.commentService.deleteComment({
        commentId,
        userId: user.userId,
      });

      return res.status(204).send();
    } catch (err: any) {
      if (err.status === 400)
        return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403) {
        const msg = err.message.includes("자신이 작성한 댓글")
          ? "자신이 작성한 댓글만 삭제할 수 있습니다"
          : "프로젝트 멤버가 아닙니다";
        return res.status(403).json({ message: msg });
      }
      if (err.status === 404) return res.status(404).send();
      console.error(err);
      return res.status(500).json({ message: "서버 에러" });
    }
  };
}
