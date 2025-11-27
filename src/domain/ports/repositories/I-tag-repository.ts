import { NewTagEntity, PersistTagEntity } from "../../entities/tag/tag-entity";

export interface ITagRepository {
  findOrCreate(tags: NewTagEntity[]): Promise<PersistTagEntity[]>;
}
