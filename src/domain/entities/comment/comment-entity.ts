import { Prisma } from "@prisma/client";
import { AuthorVo } from "./author-vo";


const commentRecord = Prisma.validator<Prisma.CommentInclude>()({
  user: true

});
export type PersistComment = Prisma.CommentGetPayload<{
  include: typeof commentRecord;
}>;



export type NewCommentEntity = Omit<
  CommentEntity,
  "id" | "createdAt" | "updatedAt" | "author"
>;


export type PersistCommentEntity = {
  id: number;
  content: string;
  taskId: number;
  author: AuthorVo;
  createdAt: Date;
  updatedAt: Date;
};

export class CommentEntity {
  private readonly _id?: number;
  private readonly _taskId: number;
  private readonly _userId?: number;
  private readonly _author?: AuthorVo;
  private _content: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(attrs: {
    id?: number;
    taskId: number;
    userId?: number;
    author?: AuthorVo;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = attrs.id;
    this._taskId = attrs.taskId;
    this._userId = attrs.userId;
    this._author = attrs.author;
    this._content = attrs.content;
    this._createdAt = attrs.createdAt;
    this._updatedAt = attrs.updatedAt;
  }

  get id() {
    return this._id;
  }
  get taskId() {
    return this._taskId;
  }
  get userId() {
    return this._userId;
  }
  get content() {
    return this._content;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }

  get author() {
    return this._author;
  }

  update(content: string) {
    this._content = content;
  }

  static createNew(params: {
    content: string;
    taskId: number;
    userId: number;
  }) {
    return new CommentEntity({
      content: params.content,
      taskId: params.taskId,
      userId: params.userId
    }) as NewCommentEntity;
  }

  static createPersist(params: {
    id: number;
    taskId: number;
    userId: number;
    author: AuthorVo;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return new CommentEntity({
      id: params.id,
      taskId: params.taskId,
      author: params.author,
      content: params.content,
      createdAt: params.createdAt,
      updatedAt: params.updatedAt,
    }) as PersistCommentEntity;
  }
}
