import { Request, Response } from "express";
import { BaseController } from "./base-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { IServices } from "../ports/I-services";
import {
  createCommentBodySchema,
  createCommentParamsSchema,
  taskCommentParamschema,
  taskCommentQuerySchema,
  updateCommentBodySchema,
  updateCommentParamsSchema,
} from "../requests/comment-req-dto";

export class CommentController extends BaseController {
  private readonly _authMiddlewares;

  constructor(services: IServices, authMiddleware: AuthMiddleware) {
    super({ basePath: "/", services: services });
    this._authMiddlewares = authMiddleware;
    this.registerRoutes();
  }

  registerRoutes() {
    // 댓글 생성
    this.router.post(
      "/tasks/:taskId/comments",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.createComment),
    );

    // 댓글 목록 조회
    this.router.get(
      "/tasks/:taskId/comments",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.listComments),
    );

    // 댓글 조회
    this.router.get(
      "/comments/:commentId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.getComment),
    );

    // 댓글 수정
    this.router.patch(
      "/comments/:commentId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.updateComment),
    );

    // 댓글 삭제
    this.router.delete(
      "/comments/:commentId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.deleteComment),
    );
  }

  createComment = async (req: Request, res: Response) => {
    const body = this.validate(createCommentBodySchema, req.body);
    const params = this.validate(createCommentParamsSchema, req.params);

    const commentResDto = await this.services.comment.createComment({
      ...body,
      ...params,
      userId: Number(req.userId),
    });

    return res.json(commentResDto);
  };

  listComments = async (req: Request, res: Response) => {
    const query = this.validate(taskCommentQuerySchema, req.query);
    const params = this.validate(taskCommentParamschema, req.params);

    const commentResDto = await this.services.comment.getCommentList({
      ...query,
      ...params,
      userId: Number(req.userId),
    });

    return res.json(commentResDto);
  };

  getComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const commentResDto = await this.services.comment.getCommentDetail(
      Number(commentId),
    );
    return res.json(commentResDto);
  };

  updateComment = async (req: Request, res: Response) => {
    const body = this.validate(updateCommentBodySchema, req.body);
    const params = this.validate(updateCommentParamsSchema, req.params);

    const commentResDto = await this.services.comment.editComment({
      ...body,
      ...params,
      userId: Number(req.userId),
    });

    return res.json(commentResDto);
  };

  deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    await this.services.comment.deleteComment(Number(commentId));
    return res.json();
  };
}
