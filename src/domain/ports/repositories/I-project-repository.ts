import { CreatorMemverEntity } from "../../entities/member/member-entity";
import {
  PersistProjectEntity,
  NewProjectEntity,
  ProjectEntity,
  ReturnProjectEntity,
  UpdateProjectEntity,
} from "../../entities/project/project-entity";

export type LockType = "share" | "beta";

export interface IProjectRepository {
  create(
    entity: NewProjectEntity,
    creator: CreatorMemverEntity,
  ): Promise<ReturnProjectEntity>;
  findById(projectId: number): Promise<ReturnProjectEntity | null>;
  update(entity: UpdateProjectEntity): Promise<ReturnProjectEntity>;
  delete(projectId: number): Promise<void>;
}
