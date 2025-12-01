// import { PersistTaskEntity } from "../../../2_domain/entites/task/task-entity";
import {
  CreateSubTaskDto,
  DeleteSubTaskDto,
  SubTaskDto,
  SubTasksDto,
  UpdateSubTaskDto,
} from "../../requests/subtask-req-dto";
import { SubTaskResDto, SubTaskResDtos } from "../../responses/subtask-res-dto";

export interface ISubTaskService {
  createSubTask(reqDto: CreateSubTaskDto): Promise<SubTaskResDto>;
  getSubTasks(reqDto: SubTasksDto): Promise<SubTaskResDto[]>;
  getSubTaskInfo(reqDto: SubTaskDto): Promise<SubTaskResDto>;
  editSubTaskInfo(reqDto: UpdateSubTaskDto): Promise<SubTaskResDto>;
  deleteSubTaskInfo(dto: DeleteSubTaskDto): Promise<void>;
}
