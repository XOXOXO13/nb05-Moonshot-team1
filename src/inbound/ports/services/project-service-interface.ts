import { PersistProjectEntity } from "../../../domain/entites/project/project-entity";
import { CreateProjectDto, UpdateProjectDto } from "../../requests/project-req-dto";

export interface IProjectService {
  createProject(dto: CreateProjectDto): Promise<PersistProjectEntity>;
  updateProject(dto: UpdateProjectDto): Promise<PersistProjectEntity>;
  getProjectById(projectId: number): Promise<PersistProjectEntity | null>;
  deleteProject(projectId: number, userId: number): Promise<void>;
}
