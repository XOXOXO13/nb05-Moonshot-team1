import { IProjectService } from "../../inbound/ports/services/project-service-interface";
import { CreateProjectDto } from "../../inbound/requests/project-req-dto";
import { UnitOfWork } from "../../outbound/unit-of-work";
import {
  PersistProjectEntity,
  ProjectEntity,
} from "../entites/project/project-entity";
// IUnitOfWork 구현후 대체

export class ProjectService implements IProjectService {
  private readonly _unitOfWokr;

  constructor(unitOfWork: UnitOfWork) {
    this._unitOfWokr = unitOfWork;
  }

  async createProject(dto: CreateProjectDto): Promise<PersistProjectEntity> {
    return this._unitOfWokr.do(async (repos) => {
      const newProject = ProjectEntity.createNew({
        name: dto.name,
        description: dto.description,
        userId: dto.userId,
      });

      return await repos.projectRepository.create(newProject);
    }, false);
  }

  // 쓰기 작업을 하기 때문에 낙관적 락 이용
  async updateProject(dto: any): Promise<PersistProjectEntity> {
    return this._unitOfWokr.do(async (repos) => {
      const project = await repos.projectRepository.findById(dto.projectId);

      if (!project) {
        throw new Error("Not found");
      }
      if (dto.name) {
        project.updateName(dto.name);
      }
      if (dto.description) {
        project.updateDescription(dto.description);
      }

      project.incrementVersion();

      return await repos.projectRepository.update(project);
    });
  }

  // 읽기 전용 => 낙관적 락 불필요
  async getProjectById(
    projectId: number,
  ): Promise<PersistProjectEntity | null> {
    return this._unitOfWokr.repos.projectRepository.findById(projectId);
  }
  
  async deleteProject(projectId: number, userId: number): Promise<void> {
    return this._unitOfWokr.do(async (repos)=>{
      const project = await repos.projectRepository.findById(projectId);

      if(!project){
        // 에러 처리
        throw new Error;
      }

      if(project.userId !== userId){
        // 에러 처리 : 권한 없음
        throw new Error;
      }

      await repos.projectRepository.delete(projectId);
    })
  }
}
