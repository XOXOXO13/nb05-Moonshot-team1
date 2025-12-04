import {
  CreateCommentDto,
  TaskCommentDto,
  updateCommentDto,
} from "../../requests/comment-req-dto";
import { CommentResDto } from "../../responses/comment-dto";

export interface ICommentService {
  createComment(dto: CreateCommentDto): Promise<CommentResDto>;
  getCommentList(dto: TaskCommentDto): Promise<CommentResDto[]>;
  getCommentDetail(commentId: number): Promise<CommentResDto>;
  editComment(dto: updateCommentDto): Promise<CommentResDto>;
  deleteComment(commentId: number): void;
}
