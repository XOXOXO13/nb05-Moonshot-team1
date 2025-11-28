import { PersistProjectEntity, ReturnProjectEntity } from "../../../domain/entities/project/project-entity";
import { ReturnPersistProject } from "../../../outbound/repos/project-repository";
import {
  CreateProjectDto,
  UpdateProjectDto,
} from "../../requests/project-req-dto";

export interface IProjectService {
  createProject(dto: CreateProjectDto): Promise<ReturnProjectEntity>;
  updateProject(dto: UpdateProjectDto): Promise<ReturnProjectEntity>;
  getProjectById(projectId: number): Promise<ReturnProjectEntity>;
  deleteProject(projectId: number, userId: number): Promise<void>;
}
