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

export class TaskService implements ITaskService {
  private readonly _unitOfWork;
  constructor(unitOfWork: UnitOfWork) {
    this._unitOfWork = unitOfWork;
  }

  async createTask(dto: CreateTaskDto): Promise<TaskResDto> {
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

    // 날짜 파싱
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    // 할 일 생성 (transaction)
    const task = await this._unitOfWork.do(async (repos) => {
      // 태그 생성하기
      const tagEntities = TagMapper.toCreateEntities(tags);
      const createdTags = await repos.tagRepository.findOrCreate(tagEntities);

      // 할 일에 태그와 첨부파일 추가
      const attachmentEntities = AttachmentMapper.toCreateEntities(attachments);
      const taskEntity = TaskEntity.createNew({
        projectId,
        title,
        description,
        startDate,
        endDate,
        status,
        attachments: attachmentEntities, // 첨부파일 추가
        taskTags: createdTags.map((tag) => {
          // 태그 추가
          return TaskTagVo.createNew(tag);
        }),
        assigneeId: userId,
      });

      // 할 일 생성
      const task = await repos.taskRepository.create(taskEntity);
      return task;
    });

    return TaskMapper.toResDto(task);
  }

  async getProjectTasks(dto: ProjectTaskDto): Promise<TaskResDtos> {
    const tasks = await this._unitOfWork.do(async (repos) => {
      // 할 일 조회하기
      const tasks = await repos.taskRepository.getProjectTasks({
        ...dto,
      });
      return tasks;
    });
    return TaskMapper.toResDtos(tasks);
  }

  async getTaskInfo(dto: TaskDto): Promise<TaskResDto> {
    const task = await this._unitOfWork.do(async (repos) => {
      // 할 일 조회하기
      const tasks = await repos.taskRepository.getTaskInfo(dto.taskId);
      return tasks;
    });
    return TaskMapper.toResDto(task);
  }

  async editTaskInfo(dto: UpdateTaskDto): Promise<TaskResDto> {
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

    // 날짜 파싱
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    // @ transaction
    const task = await this._unitOfWork.do(async (repos) => {
      // 현재 할 일 조회
      const currentTask = await repos.taskRepository.getTaskInfo(dto.taskId);

      // 새로운 태그와 첨부파일 생성
      const tagEntities = TagMapper.toCreateEntities(tags);
      const createdTags = await repos.tagRepository.findOrCreate(tagEntities);
      const attachmentEntities = AttachmentMapper.toCreateEntities(attachments);

      // 할 일 수정
      currentTask.update({
        title,
        description,
        startDate,
        endDate,
        status,
        attachments: attachmentEntities,
        taskTags: createdTags.map((tag) => {
          return TaskTagVo.createNew(tag);
        }),
      });

      const task = await repos.taskRepository.update(currentTask);
      return task;
    });

    return TaskMapper.toResDto(task);
  }

  async deleteTaskInfo(dto: TaskDto): Promise<void> {
    // 할 일 삭제하기
    await this._unitOfWork.do(async (repos) => {
      await repos.taskRepository.delete(dto.taskId);
    });
  }
}
