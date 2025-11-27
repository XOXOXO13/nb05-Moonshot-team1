export type NewTagEntity = Omit<TagEntity, "id">;
export interface PersistTagEntity extends TagEntity {
  id: number;
}

// create

export class TagEntity {
  private readonly _id?: number;
  private readonly _name: string;

  constructor(params: { id?: number; name: string }) {
    this._id = params.id;
    this._name = params.name;
  }

  static createNew(name: string) {
    return new TagEntity({ name }) as NewTagEntity;
  }

  static createPersist(record: { id: number; name: string }) {
    return new TagEntity(record) as PersistTagEntity;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
}
