import { IProjectRepository } from "../../domain/ports/repositories/I-project-repository";
import { BasePrismaClient, BaseRepository } from "./base-repository";
import {
  NewProjectEntity,
  PersistProjectEntity,
  ProjectEntity,
  ReturnProjectEntity,
  UpdateProjectEntity,
} from "../../domain/entities/project/project-entity";
import { Member, Project, Task } from "@prisma/client";
import { ProjectMapper } from "../mappers/project-mapper";
import {
  TechnicalException,
  TechnicalExceptionType,
} from "../../shared/exceptions/technical.exception";
import { CreatorMemverEntity } from "../../domain/entities/member/member-entity";

export type PersistProject = Project & {
  members: Member[];
};

export type ReturnPersistProject = Project & {
  members: Member[];
  tasks: Task[];
};

export class ProjectRepository
  extends BaseRepository
  implements IProjectRepository
{
  constructor(prismaClient: BasePrismaClient) {
    super(prismaClient);
  }

  async findById(projectId: number): Promise<ReturnProjectEntity | null> {
    const project = await this._prismaClient.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: true,
        tasks: true,
      },
    });
    return project ? ProjectEntity.createReturnPersist(project) : null;
  }

  async create(
    entity: NewProjectEntity,
    creator: CreatorMemverEntity
  ): Promise<ReturnProjectEntity> {
    try {
      const createData = {
        ...entity.toCreateData(),
        members: {
          create: {
            userId: creator.userId,
            role: creator.role,
            status: creator.status,
          },
        },
      };
      const createdProject = await this._prismaClient.project.create({
        data: createData,
        include: {
          members: true,
          tasks: true,
        },
      });
      return ProjectEntity.createReturnPersist(createdProject);
    } catch (err) {
      throw new TechnicalException({
        type: TechnicalExceptionType.DB_QUERY_FAILED,
      });
    }
  }

  async update(data: UpdateProjectEntity): Promise<ReturnProjectEntity> {
    const { projectId, ...updateData } = data;
    try {
      const updatedProject = await this._prismaClient.project.update({
        where: {
          id: projectId,
        },
        data: {
          ...updateData,
          version: { increment: 1 },
        },
        include: {
          members: true,
          tasks: true,
        },
      });
      return ProjectEntity.createReturnPersist(updatedProject);
    } catch (err) {
      throw new TechnicalException({
        type: TechnicalExceptionType.DB_QUERY_FAILED,
      });
    }
  }

  async delete(projectId: number): Promise<void> {
    try {
      await this._prismaClient.project.delete({
        where: {
          id: projectId,
        },
      });
    } catch (err) {
      throw new TechnicalException({
        type: TechnicalExceptionType.DB_QUERY_FAILED,
      });
    }
  }
}
