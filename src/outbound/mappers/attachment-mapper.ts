import { AttachmentEntity } from "../../domain/entites/task/attachment-entity";

export class AttachmentMapper {
    static toCreateEntities(attachments: string[]) {
        return attachments.map((attachmentUrl: string) => { return AttachmentEntity.createNew(attachmentUrl) });
    }
}