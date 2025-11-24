import { IProjectRepository } from "./project-repository-interface";
import { ITaskRepository } from "./I-task-repository";
import { IUserRepository } from "./I-user-repository";

export interface IRepositories {
  projectRepository: IProjectRepository;
  taskRepository: ITaskRepository;
  userRepository: IUserRepository;
}
