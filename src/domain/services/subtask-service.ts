import { ITaskService } from "../../inbound/ports/services/I-task-service";
import {
  CreateTaskDto,
  ProjectTaskDto,
  TaskDto,
  UpdateTaskDto,
} from "../../inbound/requests/task-req-dto";
import { TaskEntity } from "../entities/task/task-entity";
import { UnitOfWork } from "../../outbound/unit-of-work";
import { TagMapper } from "../../outbound/mappers/tag-mapper";
import { AttachmentMapper } from "../../outbound/mappers/attachment-mapper";
import { TaskMapper } from "../../outbound/mappers/task-mapper";
import { TaskResDto, TaskResDtos } from "../../inbound/responses/task-res-dto";
import { TaskTagVo } from "../entities/task/task-tag-vo";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../shared/exceptions/business-exception";
import { ISubTaskService } from "../../inbound/ports/services/I-subtask-service";
import {
  CreateSubTaskDto,
  DeleteSubTaskDto,
  SubTaskDto,
  SubTasksDto,
  UpdateSubTaskDto,
} from "../../inbound/requests/subtask-req-dto";
import { SubTaskEntity } from "../entities/subtask/subtask-entity";
import { SubTaskMapper } from "../../outbound/mappers/subtask-mapper";
import {
  SubTaskResDto,
  SubTaskResDtos,
} from "../../inbound/responses/subtask-res-dto";
import { TechnicalException } from "../../shared/exceptions/technical.exception";

export class SubTaskService implements ISubTaskService {
  private readonly _unitOfWork;
  constructor(unitOfWork: UnitOfWork) {
    this._unitOfWork = unitOfWork;
  }

  async createSubTask(dto: CreateSubTaskDto): Promise<SubTaskResDto> {
    const { title, taskId, status } = dto;
    const subTaskEntity = SubTaskEntity.createNew({ title, taskId, status });
    const subTask =
      await this._unitOfWork.repos.subTaskRepository.create(subTaskEntity);
    return SubTaskMapper.toResDto(subTask);
  }

  async getSubTasks(dto: SubTasksDto): Promise<SubTaskResDtos> {
    const { page, limit, taskId } = dto;
    const subTasks = await this._unitOfWork.repos.subTaskRepository.getSubTasks(
      { page, limit, taskId },
    );
    return SubTaskMapper.toResDtos(subTasks);
  }

  async getSubTaskInfo(dto: SubTaskDto): Promise<SubTaskResDto> {
    const task = await this._unitOfWork.repos.subTaskRepository.getSubTaskInfo(
      dto.subtaskId,
    );
    if (!task) {
      throw new BusinessException({
        type: BusinessExceptionType.RECORD_NOT_FOUND,
      });
    }
    return SubTaskMapper.toResDto(task);
  }

  async editSubTaskInfo(dto: UpdateSubTaskDto): Promise<SubTaskResDto> {
    // 필요한 정보 파싱하기
    const { title, status, subtaskId } = dto;

    const newSubTask = SubTaskEntity.createUpdate({ title, status, subtaskId });
    const subTask =
      await this._unitOfWork.repos.subTaskRepository.update(newSubTask);

    return SubTaskMapper.toResDto(subTask);
  }

  async deleteSubTaskInfo(dto: DeleteSubTaskDto): Promise<void> {
    await this._unitOfWork.repos.subTaskRepository.delete(dto.subtaskId);
  }
}
