// import { PersistTaskEntity } from "../../../2_domain/entites/task/task-entity";
import {
  CreateTaskDto,
  ProjectTaskDto,
  TaskDto,
  UpdateTaskDto,
} from "../../requests/task-req-dto";
import { TaskResDto, TaskResDtos } from "../../responses/task-res-dto";

export interface ITaskService {
  createTask(reqDto: CreateTaskDto): Promise<TaskResDto>;
  // getProjectTasks(reqDto: ProjectTaskDto): Promise<TaskResDtos>;
  // getTaskInfo(reqDto: TaskDto): Promise<TaskResDto>;
  // editTaskInfo(reqDto: UpdateTaskDto): Promise<TaskResDto>;
  // deleteTaskInfo(reqDto: TaskDto): Promise<void>;
}
