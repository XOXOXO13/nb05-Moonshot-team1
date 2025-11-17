

export class AttachmentEntity {
    private readonly id: number;
    private readonly url: string;
    // private readonly taskId: number;

    constructor(record: {
        id: number,
        fileUrl: string,
        taskId: number
    }) {
        this.id = record.id;
        this.url = record.fileUrl;
        // this.taskId = record.taskId;
    }
}

