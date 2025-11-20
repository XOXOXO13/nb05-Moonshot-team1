// import { PersistTaskEntity } from "../../../2_domain/entites/task/task-entity";
import {
  CreateTaskReqDto,
  ProjectTaskReqDto,
  TaskInfoReqDto,
  UpdateTaskReqDto,
} from "../../requests/task-req-dto";
import { TaskResDto, TaskResDtos } from "../../responses/task-res-dto";

export interface ITaskService {
  createTask(reqDto: CreateTaskReqDto): Promise<TaskResDto>;
  getProjectTasks(reqDto: ProjectTaskReqDto): Promise<TaskResDtos>;
  getTaskInfo(reqDto: TaskInfoReqDto): Promise<TaskResDto>;
  editTaskInfo(reqDto: UpdateTaskReqDto): Promise<TaskResDto>;
  deleteTaskInfo(reqDto: TaskInfoReqDto): Promise<void>;
}
