import { constrainedMemory } from "process";
import { IProjectRepository } from "../../domain/ports/repositories/project-repository-interface";
import { BasePrismaClient, BaseRepository } from "./base-repository";
import { NewProjectEntity, PersistProjectEntity, ProjectEntity } from "../../domain/entities/project/project-entity";

export class ProjectRepository extends BaseRepository implements IProjectRepository{
  // 일단 n+1 문제가 일어나지 않는다고 가정하에 _includeOptions 을 설정하지 않음.
  // 추후 member 와 task 모델사이의 관계가 추가되면 추가 예정
  // private _includeOptions: Prisma.ProjectInclude;
  
  constructor(prismaClient: BasePrismaClient){
    super(prismaClient);
  }

  async findById(projectId: number): Promise<PersistProjectEntity | null> {
    const project = await this._prismaClient.project.findUnique({
      where:{
        id: projectId 
      }
    })
  }

  async create(entity: NewProjectEntity) {
    
  }

  async update(entity: ProjectEntity): Promise<PersistProjectEntity> {
    
  }
}