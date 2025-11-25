import { ITaskService } from "../../inbound/ports/services/I-task-service";
import {
  CreateTaskDto,
  ProjectTaskDto,
} from "../../inbound/requests/task-req-dto";
import { TaskEntity } from "../entites/task/task-entity";
import { UnitOfWork } from "../../outbound/unit-of-work";
import { TagMapper } from "../../outbound/mappers/tag-mapper";
import { AttachmentMapper } from "../../outbound/mappers/attachment-mapper";
import { TaskTagVo } from "../entites/task/task-tag-entity";
import { TaskMapper } from "../../outbound/mappers/task-mapper";
import { TaskResDto, TaskResDtos } from "../../inbound/responses/task-res-dto";

export class TaskService implements ITaskService {
  private readonly _unitOfWork;
  constructor(unitOfWork: UnitOfWork) {
    this._unitOfWork = unitOfWork;
  }

  async createTask(dto: CreateTaskDto): Promise<TaskResDto> {
    const {
      title,
      startYear, startMonth, startDay,
      endYear, endMonth, endDay,
      status,
      tags,
      attachments,
      projectId,
      userId
    } = dto;

    // 날짜 파싱
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    // @ transaction 
    const taskResDto = this._unitOfWork.do(async (repos) => {
      // 태그 생성하기
      const tagEntites = TagMapper.toCreateEntities(tags);
      const createdTags = await repos.tagRepository.findOrCreate(tagEntites);

      // 할 일 생성하기 
      const attachmentEntities = AttachmentMapper.toCreateEntities(attachments);
      const taskEntity = TaskEntity.createNew({
        projectId,
        title,
        startDate,
        endDate,
        status,
        attachments: attachmentEntities,
        taskTags: createdTags.map((tag) => {
          return TaskTagVo.createNew(tag);
        }),
        assigneeId: userId
      });

      // 할 일과 유저 조회하기
      const task = await repos.taskRepository.create(taskEntity);
      const user = await repos.userRepository.findById(userId);

      if (!user) { throw new Error("유저를 찾을 수 없습니다.") };
      return TaskMapper.toResDto(task, user);
    })

    return taskResDto;

    // 태그, 첨부파일, 할 일 객체 생성 (개별적인 테이블, 동시성 문제 x, inconsistency 문제 O => transaction)
    // phantom read => unique ()
    // const tagEntites = tags.map((tagName: string) => { return TagEntity.createNew(tagName) });



    // tag 레포지토리로 가져오기 (Unit of work 활용하기)


    // 조회를 한번 더해서 taskJoinTag
  }

  // async getProjectTasks(dto: ProjectTaskDto): Promise<TaskResDtos> {
  //   const { page, limit, status, assignee, keyword,
  //     order, order_by, projectId, userId } = dto


  //   this._unitOfWork.do(async (repos) => {
  //     const tasks = await repos.taskRepository.getProjectTasks({
  //       page, limit, status, assignee, keyword,
  //       order, order_by, projectId
  //     });

      
  //   })

  //   // return TaskMapper.toResDtos(tasks);
  // }

  // async getTaskInfo(dto: TaskDto): Promise<TaskResDto> {
  //   const entity = TaskQuery.fromTaskInfoDto(dto);
  //   const task = await this._repo.taskRepository.getTaskInfo(entity);
  //   return TaskMapper.toResDto(task);
  // }

  // async editTaskInfo(dto: UpdateTaskDto): Promise<TaskResDto> {
  //   const entity = TaskEntity.fromUpdateDto(dto);
  //   const task = await this._repo.taskRepository.update(entity);
  //   return TaskMapper.toResDto(task);
  // }

  // async deleteTaskInfo(dto: TaskDto): Promise<void> {
  //   const entity = TaskQuery.fromTaskInfoDto(dto);
  //   await this._repo.taskRepository.delete(entity);
  // }
}
