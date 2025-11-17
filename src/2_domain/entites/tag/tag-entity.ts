export class TagEntity {
    private readonly id: number;
    private readonly name: string;
    // private readonly taskId: number;


    constructor(record: {
        id: number,
        taskId: number,
        name: string
    }) {
        this.id = record.id;
        this.name = record.name;
        // this.taskId = record.taskId;
    }
}