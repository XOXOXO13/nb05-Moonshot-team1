import { ITestRepository } from "./repositories/I-test-repository";
import { IProjectRepository } from "./repositories/project-repository-interface";

export interface IRepositories {
  testRepository: ITestRepository;
  projectRepository: IProjectRepository;
}
