import { MemberRole } from "@prisma/client";
import { IProjectService } from "../../inbound/ports/services/I-project-service";
import {
  CreateProjectDto,
  UpdateProjectDto,
} from "../../inbound/requests/project-req-dto";
import { ReturnPersistProject } from "../../outbound/repos/project-repository";
import { UnitOfWork } from "../../outbound/unit-of-work";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../shared/exceptions/business-exception";
import { CreatorMemverEntity } from "../entities/member/member-entity";
import {
  PersistProjectEntity,
  ProjectEntity,
  ReturnProjectEntity,
  UpdateProjectEntity,
} from "../entities/project/project-entity";

export class ProjectService implements IProjectService {
  private readonly _unitOfWokr;

  constructor(unitOfWork: UnitOfWork) {
    this._unitOfWokr = unitOfWork;
  }

  async createProject(dto: CreateProjectDto): Promise<ReturnProjectEntity> {
    return this._unitOfWokr.do(async (repos) => {
      const newProject = ProjectEntity.createNew({
        name: dto.name,
        description: dto.description,
        userId: dto.userId,
      });

      const creator: CreatorMemverEntity = {
        userId: dto.userId,
        role: "OWNER",
        status: "ACTIVE",
      };

      const createdProject = await repos.projectRepository.create(
        newProject,
        creator,
      );
      return createdProject;
    }, false);
  }

  // 쓰기 작업을 하기 때문에 낙관적 락 이용
  async updateProject(dto: UpdateProjectDto): Promise<ReturnProjectEntity> {
    return this._unitOfWokr.do(async (repos) => {
      const project = await repos.projectRepository.findById(dto.projectId);
      if (!project) {
        throw new BusinessException({
          type: BusinessExceptionType.INVALID_PROJECTID,
        });
      }

      const role: MemberRole | null =
        await this._unitOfWokr.repos.memberRepository.getRoleById(
          dto.projectId,
          dto.userId,
        );
      if (role !== "OWNER") {
        throw new BusinessException({
          type: BusinessExceptionType.UNAUTORIZED_REQUEST,
        });
      }

      if (
        dto.name === project.name &&
        dto.description === project.description
      ) {
        throw new BusinessException({
          type: BusinessExceptionType.UPDATE_TARGET_NOT_FOUND,
        });
      }
      project.name = dto.name;
      project.description = dto.description;

      const updateData: UpdateProjectEntity = {
        name: project.name,
        description: project.description,
        projectId: project.id,
      };

      return await repos.projectRepository.update(updateData);
    });
  }

  // 읽기 전용 => 낙관적 락 불필요
  async getProjectById(projectId: number): Promise<ReturnProjectEntity> {
    const project =
      await this._unitOfWokr.repos.projectRepository.findById(projectId);
    if (!project) {
      throw new BusinessException({
        type: BusinessExceptionType.INVALID_PROJECTID,
      });
    }
    return project;
  }

  async deleteProject(projectId: number, userId: number): Promise<void> {
    return this._unitOfWokr.do(async (repos) => {
      const project = await repos.projectRepository.findById(projectId);

      if (!project) {
        throw new BusinessException({
          type: BusinessExceptionType.INVALID_PROJECTID,
        });
      }
      const role: MemberRole | null =
        await this._unitOfWokr.repos.memberRepository.getRoleById(
          projectId,
          userId,
        );
      if (role !== "OWNER") {
        throw new BusinessException({
          type: BusinessExceptionType.UNAUTORIZED_REQUEST,
        });
      }

      await repos.projectRepository.delete(projectId);
    });
  }
}
