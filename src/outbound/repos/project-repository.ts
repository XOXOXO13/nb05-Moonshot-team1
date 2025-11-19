import { IProjectRepository } from "../../domain/ports/repositories/project-repository-interface";
import { BasePrismaClient, BaseRepository } from "./base-repository";
import {
  NewProjectEntity,
  PersistProjectEntity,
  ProjectEntity,
} from "../../domain/entites/project/project-entity";
import { Member, Project } from "@prisma/client";
import { ProjectMapper } from "../mappers/project-mapper";

export type PersistProject = Project & {
  members: Member[] | null;
};

export class ProjectRepository
  extends BaseRepository
  implements IProjectRepository
{
  // 일단 n+1 문제가 일어나지 않는다고 가정하에 _includeOptions 을 설정하지 않음.
  // 추후 member 와 task 모델사이의 관계가 추가되면 추가 예정
  // private _includeOptions: Prisma.ProjectInclude;

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
}
