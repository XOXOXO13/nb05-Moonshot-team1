import { ICommentService } from "../../inbound/ports/services/I-comment-service";
import {
  CreateCommentDto,
  TaskCommentDto,
  updateCommentDto,
} from "../../inbound/requests/comment-req-dto";
import { CommentResDto } from "../../inbound/responses/comment-dto";
import { CommentMapper } from "../../outbound/mappers/comment-mapper";
import { TaskMapper } from "../../outbound/mappers/task-mapper";
import { UnitOfWork } from "../../outbound/unit-of-work";
import {
  PersistComment,
  PersistCommentEntity,
} from "../entities/comment/comment-entity";

export class CommentService implements ICommentService {
  private readonly _unitOfWork;

  constructor(unitOfWork: UnitOfWork) {
    this._unitOfWork = unitOfWork;
  }

  async createComment(dto: CreateCommentDto): Promise<CommentResDto> {
    const { taskId, userId, content } = dto;
    const comment = await this._unitOfWork.repos.commentRepository.create(
      taskId,
      userId,
      content,
    );
    return CommentMapper.toResDto(comment);
  }
  async getCommentList(dto: TaskCommentDto): Promise<CommentResDto[]> {
    const { taskId, page, limit } = dto;
    const comments =
      await this._unitOfWork.repos.commentRepository.findCommentsByTask(
        taskId,
        page,
        limit,
      );
    return comments.map((comment: PersistCommentEntity) => {
      return CommentMapper.toResDto(comment);
    });
  }
  async getCommentDetail(commentId: number): Promise<CommentResDto> {
    const comment =
      await this._unitOfWork.repos.commentRepository.findById(commentId);
    if (!comment) {
      throw new Error("댓글을 찾을 수 없습니다.");
    }
    return CommentMapper.toResDto(comment);
  }

  async editComment(dto: updateCommentDto): Promise<CommentResDto> {
    const { commentId, content } = dto;
    const comment = await this._unitOfWork.repos.commentRepository.update(
      commentId,
      content,
    );
    return CommentMapper.toResDto(comment);
  }
  async deleteComment(commentId: number): Promise<void> {
    await this._unitOfWork.repos.commentRepository.delete(commentId);
  }
}
