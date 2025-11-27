export type NewAttachmentEntity = Omit<AttachmentEntity, "id">;

export interface PersistAttachmentEntity extends AttachmentEntity {
  id: number;
}

export class AttachmentEntity {
  private readonly _id?: number;
  private readonly _attachmentUrl: string;

  constructor(params: { id?: number; attachmentUrl: string }) {
    this._id = params.id;
    this._attachmentUrl = params.attachmentUrl;
  }

  static createNew(attachmentUrl: string) {
    return new AttachmentEntity({ attachmentUrl });
  }

  static createPersist(params: { id: number; attachmentUrl: string }) {
    return new AttachmentEntity({
      id: params.id,
      attachmentUrl: params.attachmentUrl,
    });
  }

  toJson() {
    return {
      id: this._id,
      attachmentUrl: this._attachmentUrl,
    };
  }

  get id() {
    return this._id;
  }

  get attachmentUrl() {
    return this._attachmentUrl;
  }
}
