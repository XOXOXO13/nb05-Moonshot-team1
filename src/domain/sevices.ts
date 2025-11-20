import { IServices } from "../inbound/ports/services-interface";
import { ITaskService } from "../inbound/ports/services/I-task-service";
import { IProjectService } from "../inbound/ports/services/project-service-interface";

export class Services implements IServices{
  constructor(
    public readonly task: ITaskService,
    public readonly project: IProjectService,
  ){}
}