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
import { unknown } from "zod";

export class TaskService implements ITaskService {
  private readonly _unitOfWork;
  constructor(unitOfWork: UnitOfWork) {
    this._unitOfWork = unitOfWork;
  }

  async createTask(dto: CreateTaskDto): Promise<TaskResDto> {
    // 필요한 정보 추출
    const {
      title,
      description,
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay,
      status,
      tags,
      attachments,
      projectId,
      userId,
    } = dto;
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    const tagEntities = TagMapper.toCreateEntities(tags);
    const attachmentEntities = AttachmentMapper.toCreateEntities(attachments);

    // 할 일 생성
    const newTask = await this._unitOfWork.do(async (repos) => {
      const createdTags = await repos.tagRepository.findOrCreate(tagEntities); // 태그 생성하기
      const taskEntity = TaskEntity.createNew({
        // 할 일에 첨부파일과 태그 추가
        projectId,
        title,
        description,
        startDate,
        endDate,
        status,
        attachments: attachmentEntities, // 첨부파일 추가
        taskTags: createdTags.map((tag) => {
          return TaskTagVo.createNew(tag); // 태그 추가
        }),
        assigneeId: userId,
      });

      const task = await repos.taskRepository.create(taskEntity); // 할 일 생성
      return task;
    });

    return TaskMapper.toResDto(newTask);
  }

  async getProjectTasks(dto: ProjectTaskDto): Promise<TaskResDtos> {
    const tasks = await this._unitOfWork.repos.taskRepository.getProjectTasks({
      ...dto,
    });

    if (!tasks) {
      throw new BusinessException({
        type: BusinessExceptionType.RECORD_NOT_FOUND,
      });
    }

    return TaskMapper.toResDtos(tasks);
  }

  async getTaskInfo(dto: TaskDto): Promise<TaskResDto> {
    const task = await this._unitOfWork.repos.taskRepository.getTaskInfo(
      dto.taskId,
    );
    if (!task) {
      throw new BusinessException({
        type: BusinessExceptionType.RECORD_NOT_FOUND,
      });
    }
    return TaskMapper.toResDto(task);
  }

  async editTaskInfo(dto: UpdateTaskDto): Promise<TaskResDto> {
    // 필요한 정보 파싱하기
    const {
      title,
      description,
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay,
      status,
      tags,
      attachments,
    } = dto;

    const startDate =
      startYear && startMonth && startDay
        ? new Date(startYear, startMonth - 1, startDay)
        : undefined;

    const endDate =
      endYear && endMonth && endDay
        ? new Date(endYear, endMonth - 1, endDay)
        : undefined;

    // 새로운 태그와 첨부파일 데이터 생성
    const tagEntities = tags ? TagMapper.toCreateEntities(tags) : undefined;
    const attachmentEntities = attachments
      ? AttachmentMapper.toCreateEntities(attachments)
      : undefined;

    // @ transaction
    const task = await this._unitOfWork.do(async (repos) => {
      // 현재 할 일 조회
      const currentTask = await repos.taskRepository.getTaskInfo(dto.taskId);

      if (!currentTask) {
        throw new BusinessException({
          type: BusinessExceptionType.RECORD_NOT_FOUND,
        });
      }

      // 태그 생성
      const createdTags = tagEntities
        ? await repos.tagRepository.findOrCreate(tagEntities)
        : undefined;

      // 할 일 수정
      currentTask.update({
        title,
        description,
        startDate,
        endDate,
        status,
        attachments: attachmentEntities,
        taskTags: createdTags,
      });

      const task = await repos.taskRepository.update(currentTask);
      return task;
    });

    return TaskMapper.toResDto(task);
  }

  async deleteTaskInfo(dto: TaskDto): Promise<void> {
    await this._unitOfWork.repos.taskRepository.delete(dto.taskId);
  }
}
