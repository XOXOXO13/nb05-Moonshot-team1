import { ITaskService } from "./services/I-task-service";
import { IProjectService } from "./services/I-project-service";
import { IUserService } from "../../domain/services/user-service";

export interface IServices {
  task: ITaskService;
  project: IProjectService;
  user: IUserService;
}
