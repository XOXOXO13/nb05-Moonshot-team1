import { TaskResDto, TaskResDtos } from "../../inbound/responses/task-res-dto";
import { AttachmentEntity, PersistAttachmentEntity } from "../../domain/entites/task/attachment-entity";
import { TagEntity } from "../../domain/entites/tag/tag-entity";

import { UserEntity } from "../../domain/entites/user/user-entity";
import { Request } from "express";
import { z } from "zod";
import { NewTaskEntity, PersistTaskEntity } from "../../domain/entites/task/task-entity";
import { TaskTags } from "@prisma/client";

export type CreateTaskData = {
    projectId: number;
    title: string;
    startDate: Date;
    endDate: Date;
    status: string;
    assigneeId: number;
}

export type AttachmentData = {
    attachmentUrl: string
}


export type TaskTagsData = {
    tagId: number;
}


export class TaskMapper {
    static toCreateData(entity: NewTaskEntity) {
        const createTaskData: CreateTaskData = {
            projectId: entity.projectId,
            title: entity.title,
            startDate: entity.startDate,
            endDate: entity.endDate,
            status: entity.status,
            assigneeId: entity.assigneeId
        }

        const attachmentData: AttachmentData[] =
            entity.attachments.map((attachment) => {
                return { attachmentUrl: attachment.attachmentUrl }
            })

        const taskTagsData: TaskTagsData[] =
            entity.tasktags.map((tasktag) => {
                return {
                    tagId: tasktag.tagId
                }
            })
        return { createTaskData, attachmentData, taskTagsData };
    }



    static toResDto(task: PersistTaskEntity, user: UserEntity) {
        return new TaskResDto(
            task.id,
            task.projectId,
            task.title,
            task.startDate,
            task.endDate,
            task.status,
            user,
            task.attachments as PersistAttachmentEntity[],
            task.tasktags,
            task.createdAt,
            task.updatedAt,
        );
        //   }
    }
    //   static toResDtos(entities: PersistTaskEntity[]): TaskResDtos {
    //     const taskResDto = entities.map((entity) => {
    //       return TaskMapper.toResDto(entity);
    //     });
    //     const taskResDtos = new TaskResDtos(taskResDto);
    //     return taskResDtos;
    //   }
}
