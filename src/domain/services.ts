import { IServices } from "../inbound/ports/I-services";
import { ITaskService } from "../inbound/ports/services/I-task-service";
import { IProjectService } from "../inbound/ports/services/I-project-service";
import { IUserService } from "../inbound/ports/services/I-user-service";
import { IAuthService } from "../inbound/ports/services/I-auth-service";
import { IInvitationService } from "../inbound/ports/services/I-invitation-service";
import { IMemberService } from "../inbound/ports/services/I-member-service";
import { ISubTaskService } from "../inbound/ports/services/I-subtask-service";

export class Services implements IServices {
  constructor(
    public readonly task: ITaskService,
    public readonly subtask: ISubTaskService,
    public readonly project: IProjectService,
    public readonly user: IUserService,
    public readonly auth: IAuthService,
    public readonly invitation: IInvitationService,
    public readonly member: IMemberService,
  ) {}
}
