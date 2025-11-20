import { ITaskService } from "./services/I-task-service";
import { IProjectService } from "./services/project-service-interface";

export interface IServices {
  task: ITaskService;
  project: IProjectService;
}
