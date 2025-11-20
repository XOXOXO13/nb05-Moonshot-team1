import { PersistProjectEntity } from "../../../domain/entites/project/project-entity";

export interface IProjectService {
  createProject(dto: any): Promise<PersistProjectEntity>;
  updateProject(dto: any): Promise<PersistProjectEntity>;
  getProjectById(projectId: number): Promise<PersistProjectEntity | null>
}
