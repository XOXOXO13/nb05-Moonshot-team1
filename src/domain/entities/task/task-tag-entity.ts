// @ DB != entity
// @ Mapper 사용 (repo => service)

import { PersistTagEntity } from "../tag/tag-entity";

// @ 값 객체 (id가 X, task Entity 에 의존하니)
export class TaskTagVo {
  private readonly id;
  private readonly name;
  constructor(tagId: number, tagName: string) {
    this.id = tagId;
    this.name = tagName;
  }

  static createNew(tag: PersistTagEntity) {
    return new TaskTagVo(tag.id, tag.name);
  }

  get tagId() {
    return this.id;
  }

  get tagName() {
    return this.name;
  }
}
