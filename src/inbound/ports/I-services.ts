import { ITaskService } from "./services/I-task-service";
import { IProjectService } from "./services/I-project-service";
import { IUserService } from "./services/I-user-service";
import { IAuthService } from "./services/I-auth-service";
import { IInvitationService } from "./services/I-invitation-service";
import { IMemberService } from "./services/I-member-service";

export interface IServices {
  task: ITaskService;
  project: IProjectService;
  user: IUserService;
  auth: IAuthService;
  invitation: IInvitationService;
  member: IMemberService;
}
