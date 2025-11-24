import { IProjectRepository } from "../../domain/ports/repositories/I-project-repository";
import { BasePrismaClient, BaseRepository } from "./base-repository";
import {
  NewProjectEntity,
  PersistProjectEntity,
  ProjectEntity,
} from "../../domain/entites/project/project-entity";
import { Member, Project } from "@prisma/client";
import { ProjectMapper } from "../mappers/project-mapper";

export type PersistProject = Project & {
  members: Member[];
};

export class ProjectRepository
  extends BaseRepository
  implements IProjectRepository
{
  constructor(prismaClient: BasePrismaClient) {
    super(prismaClient);
  }

  async findById(projectId: number): Promise<PersistProjectEntity | null> {
    const project = (await this._prismaClient.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        members: true,
      },
    })) as PersistProject | null;

    return project ? ProjectMapper.toPersistEntity(project) : null;
  }

  async create(entity: NewProjectEntity): Promise<PersistProjectEntity> {
    try {
      const createData = ProjectMapper.toCreateData(entity);

      const createdProject = (await this._prismaClient.project.create({
        data: createData,
        include: {
          members: true,
        },
      })) as PersistProject;

      return ProjectMapper.toPersistEntity(createdProject);
    } catch (err) {
      // 에러 처리 추후 구현
      throw err;
    }
  }

  async update(entity: ProjectEntity): Promise<PersistProjectEntity> {
    try {
      const dataToUpdate = ProjectMapper.toUpdateData(entity);
      const updatedProject = (await this._prismaClient.project.update({
        where: {
          id: entity.id,
          version: entity.version,
        },
        data: {
          ...dataToUpdate,
          version: { increment: 1 },
        },
        include: {
          members: true,
        },
      })) as PersistProject;

      return ProjectMapper.toPersistEntity(updatedProject);
    } catch (err) {
      // 에러 처리 추후 구현
      throw err;
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
      // 에러 처리 추후 구현
      throw err;
    }
  }
}
