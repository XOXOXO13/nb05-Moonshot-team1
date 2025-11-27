import {
  NewTagEntity,
  PersistTagEntity,
  TagEntity,
} from "../../domain/entities/tag/tag-entity";

export type CreateTagData = {
  name: string;
};

export class TagMapper {
  static toCreateData(entities: NewTagEntity[]) {
    const createTagData: CreateTagData[] = entities.map(
      (entity: NewTagEntity) => {
        return { name: entity.name };
      },
    );
    return createTagData;
  }

  static toCreateEntities(tags: string[]) {
    return tags.map((tagName: string) => {
      return TagEntity.createNew(tagName);
    });
  }

  static toPersistEntites(
    records: {
      id: number;
      name: string;
    }[],
  ): PersistTagEntity[] {
    return records.map((record) => {
      return TagEntity.createPersist(record) as PersistTagEntity;
    });
  }
}
