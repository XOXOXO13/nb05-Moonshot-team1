import { PersistTaskEntity } from "../../../2_domain/entites/task/task-entity";
import { TaskReqDto, ProjectTaskReqDto, TaskInfoReqDto } from "../../requests/task-req-dto";
import { TaskResDto, TaskResDtos } from "../../responses/task-res-dto";

export interface ITaskService {
  createTask(reqDto: TaskReqDto): Promise<TaskResDto>;
  getProjectTasks(reqDto: ProjectTaskReqDto): Promise<TaskResDtos>;
  getTaskInfo(reqDto: TaskInfoReqDto): Promise<TaskResDto>;
  editTaskInfo(reqDto: TaskReqDto): Promise<TaskResDto>;

}
