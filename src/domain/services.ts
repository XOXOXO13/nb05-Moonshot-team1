import { IServices } from "../inbound/ports/I-services";
import { ITaskService } from "../inbound/ports/services/I-task-service";
import { IProjectService } from "../inbound/ports/services/I-project-service";
import { IUserService } from "../inbound/ports/services/I-user-service";
import { IAuthService } from "../inbound/ports/services/I-auth-service";

export class Services implements IServices {
  constructor(
    public readonly task: ITaskService,
    public readonly project: IProjectService,
    public readonly user: IUserService,
    public readonly auth: IAuthService,
  ) {}
}
