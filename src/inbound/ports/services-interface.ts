import { ITaskService } from "./services/I-task-service";
import { IProjectService } from "./services/project-service-interface";
import { IUserService } from "../../domain/services/user-service";

export interface IServices {
  task: ITaskService;
  project: IProjectService;
  user: IUserService;
}
