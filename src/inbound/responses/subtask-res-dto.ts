export class SubTaskResDto {
  private id: number;
  private title: string;
  private taskId: number;
  private status: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(params: {
    id: number;
    title: string;
    taskId: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    ((this.id = params.id),
      (this.title = params.title),
      (this.taskId = params.taskId),
      (this.status = params.status),
      (this.createdAt = params.createdAt),
      (this.updatedAt = params.updatedAt));
  }
}

export class SubTaskResDtos {
  private data: SubTaskResDto[];
  private total: number;

  constructor(params: { data: SubTaskResDto[] }) {
    this.data = params.data;
    this.total = this.data.length;
  }
}
