import { ITaskService } from "./services/I-task-service";
import { IProjectService } from "./services/project-service-interface";
import { IUserService } from "./services/I-user-service";
import { IAuthService } from "./services/I-auth-service";

export interface IServices {
  task: ITaskService;
  project: IProjectService;
  user: IUserService;
  auth: IAuthService;
}
