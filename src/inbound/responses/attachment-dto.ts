export class AttachmentDto {
  private readonly id: number;
  private readonly url: string;

  constructor(data: { id: number; attachmentUrl: string }) {
    this.id = data.id;
    this.url = data.attachmentUrl;
  }
}
