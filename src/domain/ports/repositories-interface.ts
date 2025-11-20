import { IProjectRepository } from "./repositories/project-repository-interface";
import { ITaskRepository } from "./repositories/I-task-repository";

export interface IRepositories {
  projectRepository: IProjectRepository;
  taskRepository: ITaskRepository;
}
