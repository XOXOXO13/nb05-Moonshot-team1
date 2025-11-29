import { TaskResDto, TaskResDtos } from "../../inbound/responses/task-res-dto";
import {
  AttachmentEntity,
  PersistAttachmentEntity,
} from "../../domain/entities/task/attachment-entity";
import {
  NewTaskEntity,
  PersistTaskEntity,
  TaskEntity,
} from "../../domain/entities/task/task-entity";
import { UserVo } from "../../domain/entities/task/user-vo";
import { TaskTagVo } from "../../domain/entities/task/task-tag-vo";

export type CreateTaskData = {
  projectId: number;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  assigneeId: number;
};

export type AttachmentData = {
  attachmentUrl: string;
};

export type TaskTagsData = {
  tagId: number;
};

export class TaskMapper {
  static toPersistEntity(
    record: {
      assignee: {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        password: string | null;
        refreshToken: string | null;
        version: number;
        profileImage: string | null;
      };
      attachments: {
        id: number;
        attachmentUrl: string;
        taskId: number;
      }[];
      taskTags: ({
        tag: {
          id: number;
          name: string;
        };
      } & {
        tagId: number;
        taskId: number;
      })[];
    } & {
      id: number;
      version: number;
      projectId: number;
      title: string;
      description: string;
      startDate: Date;
      endDate: Date;
      status: string;
      assigneeId: number;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    // 파싱 및 task entity 반환
    const {
      id,
      version,
      projectId,
      title,
      description,
      startDate,
      endDate,
      status,
      assignee,
      assigneeId,
      createdAt,
      updatedAt,
      attachments,
      taskTags,
    } = record;

    const persistTaskProps = {
      id,
      version,
      projectId,
      title,
      description,
      startDate,
      endDate,
      status,
      assigneeId,
      createdAt,
      updatedAt,
      assignee: new UserVo({
        id: assignee.id,
        name: assignee.name,
        email: assignee.email,
        profileImage: assignee.profileImage,
      }),
      attachments: attachments.map((a) =>
        AttachmentEntity.createPersist({
          id: a.id,
          attachmentUrl: a.attachmentUrl,
        }),
      ),
      taskTags: taskTags.map((t) => new TaskTagVo(t.tag.id, t.tag.name)),
    };
    // implementation goes here
    return TaskEntity.createPersist(persistTaskProps);
  }

  static toCreateData(entity: NewTaskEntity) {
    const createTaskData: CreateTaskData = {
      projectId: entity.projectId,
      title: entity.title,
      description: entity.description,
      startDate: entity.startDate,
      endDate: entity.endDate,
      status: entity.status,
      assigneeId: entity.assigneeId,
    };

    const attachmentData: AttachmentData[] = entity.attachments.map(
      (attachment) => {
        return { attachmentUrl: attachment.attachmentUrl };
      },
    );

    const taskTagsData: TaskTagsData[] = entity.taskTags.map((tasktag) => {
      return {
        tagId: tasktag.tagId,
      };
    });
    return { createTaskData, attachmentData, taskTagsData };
  }

  static toResDto(task: PersistTaskEntity) {
    return new TaskResDto(
      task.id,
      task.projectId,
      task.title,
      task.description,
      task.startDate,
      task.endDate,
      task.status,
      task.assignee,
      task.attachments as PersistAttachmentEntity[],
      task.taskTags,
      task.createdAt,
      task.updatedAt,
    );
    //   }
  }
  static toResDtos(entities: PersistTaskEntity[]): TaskResDtos {
    const taskResDto = entities.map((entity) => {
      return TaskMapper.toResDto(entity);
    });
    const taskResDtos = new TaskResDtos(taskResDto);
    return taskResDtos;
  }
}
