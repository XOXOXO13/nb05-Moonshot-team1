export type PersistCommentEntity = {
  id: number;
  taskId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NewCommentEntity = Omit<
  PersistCommentEntity,
  "id" | "createdAt" | "updatedAt"
>;

export class CommentEntity {
  private readonly _id?: number;
  private readonly _taskId: number;
  private readonly _userId: number;
  private _content: string;
  private readonly _createdAt?: Date;
  private readonly _updatedAt?: Date;

  constructor(attrs: {
    id?: number;
    taskId: number;
    userId: number;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = attrs.id;
    this._taskId = attrs.taskId;
    this._userId = attrs.userId;
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

  toJSON(): PersistCommentEntity {
    return {
      id: this._id as number,
      taskId: this._taskId,
      userId: this._userId,
      content: this._content,
      createdAt: this._createdAt as Date,
      updatedAt: this._updatedAt as Date,
    };
  }

  updateContent(newContent: string) {
    if (
      !newContent ||
      typeof newContent !== "string" ||
      newContent.trim().length === 0
    ) {
      throw new Error("잘못된 요청 형식");
    }
    this._content = newContent.trim();
  }

  //정적 생성자 - 영속화 전 (신규)
  static createNew(params: {
    taskId: number;
    userId: number;
    content: string;
  }): NewCommentEntity {
    if (
      !params.content ||
      typeof params.content !== "string" ||
      params.content.trim().length === 0
    ) {
      throw new Error("잘못된 요청 형식");
    }

    return {
      taskId: params.taskId,
      userId: params.userId,
      content: params.content.trim(),
    };
  }

  static createPersist(record: PersistCommentEntity): CommentEntity {
    return new CommentEntity({
      id: record.id,
      taskId: record.taskId,
      userId: record.userId,
      content: record.content,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
