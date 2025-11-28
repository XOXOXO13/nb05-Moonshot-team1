import { IProjectRepository } from "./repositories/I-project-repository";
import { ITaskRepository } from "./repositories/I-task-repository";
import { IUserRepository } from "./repositories/I-user-repository";
import { ITagRepository } from "./repositories/I-tag-repository";

export interface IRepositories {
  projectRepository: IProjectRepository;
  taskRepository: ITaskRepository;
  tagRepository: ITagRepository;
  userRepository: IUserRepository;
}