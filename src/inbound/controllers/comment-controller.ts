import { Request, Response } from "express";
import { CommentService } from "../../domain/services/comment-service";
import { BaseController } from "./base-controller";

export class CommentController extends BaseController {
  private commentService: CommentService;

  constructor(commentService: CommentService) {
    super({ basePath: "/", services: (null as unknown) as any });
    this.commentService = commentService;
    this.registerRoutes();
  }

  registerRoutes() {
    // 댓글 생성
    this.router.post("/tasks/:taskId/comments", this.createComment);
    // 댓글 목록 조회
    this.router.get("/tasks/:taskId/comments", this.listComments);
    // 댓글 조회
    this.router.get("/comments/:commentId", this.getComment);
    // 댓글 수정
    this.router.patch("/comments/:commentId", this.updateComment);
    // 댓글 삭제
    this.router.delete("/comments/:commentId", this.deleteComment);
  }

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
      if (err.status === 400) return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403) return res.status(403).json({ message: "프로젝트 멤버가 아닙니다" });
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
    if (Number.isNaN(taskId)) {
      return res.status(400).json({ message: "잘못된 요청 형식" });
    }

    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    if (Number.isNaN(page) || Number.isNaN(limit) || page <= 0 || limit <= 0) {
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
      if (err.status === 400) return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403) return res.status(403).json({ message: "프로젝트 멤버가 아닙니다" });
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
    if (!commentId || typeof commentId !== "string") {
      return res.status(400).json({ message: "잘못된 요청 형식" });
    }

    try {
      const result = await this.commentService.getComment({
        commentId,
        userId: user.userId,
      });
      return res.status(200).json(result);
    } catch (err: any) {
      if (err.status === 400) return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403) return res.status(403).json({ message: "프로젝트 멤버가 아닙니다" });
      if (err.status === 404) return res.status(404).json();
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
    if (!commentId || typeof commentId !== "string") {
      return res.status(400).json({ message: "잘못된 요청 형식" });
    }

    const { content } = req.body;
    try {
      const result = await this.commentService.updateComment({
        commentId,
        userId: user.userId,
        content,
      });
      return res.status(200).json(result);
    } catch (err: any) {
      if (err.status === 400) return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403) {
        const msg = err.message === "자신이 작성한 댓글만 수정할 수 있습니다" ? err.message : "프로젝트 멤버가 아닙니다";
        return res.status(403).json({ message: msg });
      }
      if (err.status === 404) return res.status(404).json();
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
    if (!commentId || typeof commentId !== "string") {
      return res.status(400).json({ message: "잘못된 요청 형식" });
    }

    try {
      await this.commentService.deleteComment({
        commentId,
        userId: user.userId,
      });
      return res.status(204).send();
    } catch (err: any) {
      if (err.status === 400) return res.status(400).json({ message: "잘못된 요청 형식" });
      if (err.status === 403) {
        const msg = err.message === "자신이 작성한 댓글만 삭제할 수 있습니다" ? err.message : "프로젝트 멤버가 아닙니다";
        return res.status(403).json({ message: msg });
      }
      if (err.status === 404) return res.status(404).json();
      console.error(err);
      return res.status(500).json({ message: "서버 에러" });
    }
  };
}