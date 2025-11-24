import { IProjectRepository } from "./repositories/I-project-repository";
import { ITaskRepository } from "./repositories/I-task-repository";
import { IUserRepository } from "./repositories/I-user-repository";

export interface IRepositories {
  projectRepository: IProjectRepository;
  taskRepository: ITaskRepository;
  userRepository: IUserRepository;
}
