import {
  MemberData,
  MemberEntity,
} from "../../domain/entites/project/member-entity";
import {
  NewProjectEntity,
  PersistProjectEntity,
  ProjectData,
  ProjectEntity,
  ProjectUpdateData,
} from "../../domain/entites/project/project-entity";
import { PersistProject } from "../repos/project-repository";

export class ProjectMapper {
  static toPersistEntity(project: PersistProject): PersistProjectEntity {
    let members: MemberEntity[] = [];

    if (project.members && project.members.length > 0) {
      members = project.members.map((member) => {
        const memberData: MemberData = {
          userId: member.userId,
          projectId: member.projectId,
          role: member.role,
          status: member.status,
          joinedAt: member.joinedAt,
        };
        return MemberEntity.createPersist(memberData);
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
      members: members,
    }) as PersistProjectEntity;
  }

  static toCreateData(entity: NewProjectEntity) {
    const projectData = entity.toCreateData();

    const prismaData = {
      ...projectData,
    };

    return prismaData;
  }
  static toUpdateData(entity: ProjectEntity): ProjectUpdateData {
    const updateData = entity.toUpdateData();
    return updateData;
  }

  static getOwnerMemberEntity(entity: NewProjectEntity): MemberEntity {
    const owner = entity.members?.[0];

    if (!owner) {
      throw new Error();
    }

    return owner;
  }
}
