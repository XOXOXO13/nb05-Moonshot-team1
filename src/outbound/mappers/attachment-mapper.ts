import { AttachmentEntity } from "../../domain/entities/task/attachment-entity";

export class AttachmentMapper {
  static toCreateEntities(attachments: string[]) {
    return attachments.map((attachmentUrl: string) => {
      return AttachmentEntity.createNew(attachmentUrl);
    });
  }
}
