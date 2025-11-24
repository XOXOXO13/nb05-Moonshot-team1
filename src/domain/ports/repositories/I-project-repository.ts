import {
  PersistProjectEntity,
  NewProjectEntity,
  ProjectEntity,
} from "../../entites/project/project-entity";

export type LockType = "share" | "beta";

export interface IProjectRepository {
  create(entity: NewProjectEntity): any;
  findById(projectId: number): Promise<PersistProjectEntity | null>;
  update(entity: ProjectEntity): Promise<PersistProjectEntity>;
  delete(projectId: number): Promise<void>;
}
