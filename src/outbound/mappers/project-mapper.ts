import { MemberData, MemberVo } from "../../domain/entities/project/member-vo";
import {
  NewProjectEntity,
  PersistProjectEntity,
  ProjectData,
  ProjectEntity,
} from "../../domain/entities/project/project-entity";
import { PersistProject } from "../repositories/project-repository";

export class ProjectMapper {
  static toPersistEntity(project: PersistProject): PersistProjectEntity {
    let membersVo: MemberVo[] = [];

    if (project.members && project.members.length > 0) {
      membersVo = project.members.map((member) => {
        const memberData: MemberData = {
          userId: member.userId,
          role: member.role,
          status: member.status,
        };
        return MemberVo.createPersist(memberData);
      });
    }

    return ProjectEntity.createPersist({
      id: project.id,
      name: project.name,
      description: project.description ?? null,
      userId: project.userId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      version: project.version,
      members: membersVo,
    }) as PersistProjectEntity;
  }

  static toCreateData(entity: NewProjectEntity) {
    const projectData = entity.toCreateData();

    const prismaData = {
      ...projectData,
      members: projectData.members
        ? {
            create: projectData.members,
          }
        : undefined,
    };
    if (prismaData.description === null) {
      delete prismaData.description;
    }

    return prismaData;
  }
  static toUpdateData(entity: ProjectEntity) {
    return entity;
  }
}
