import { AuthorVo } from "../../domain/entities/comment/author-vo";

export class CommentResDto {

    id: number;
    content: string;
    taskId: number;
    author: AuthorVo;
    createdAt: Date;
    updatedAt: Date;



    constructor(params: {
        id: number;
        content: string;
        taskId: number;
        author: AuthorVo;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = params.id;
        this.content = params.content;
        this.taskId = params.taskId;
        this.author = params.author;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }
}