import { MemberRole } from "@prisma/client";
import {
  MemberEntity,
  ProjectMemberData,
} from "../../domain/entities/member/member-entity";
import { IMemberRepository } from "../../domain/ports/repositories/I-member-repository";
import { MemberMapper } from "../mappers/member-mapper";
import { BasePrismaClient, BaseRepository } from "./base-repository";

export class MemberRepository
  extends BaseRepository
  implements IMemberRepository
{
  constructor(prismaClient: BasePrismaClient) {
    super(prismaClient);
  }
  async getProjectMembers(
    projectId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<ProjectMemberData[] | null> {
    const users = await this._prismaClient.member.findMany({
      where: {
        projectId: projectId,
      },
      select: {
        user: {
          include: {
            assignedTasks: true,
          },
        },
        status: true,
      },
    });

    if (!users) {
      return null;
    }
    const members = users.map((user) => user.user);
    return members.map((member) => {
      return MemberEntity.createMemberData(member);
    });
  }

  async getProjectMembersId(projectId: number): Promise<number[] | null> {
    const members = await this._prismaClient.member.findMany({
      where: {
        projectId: projectId,
      },
      select: {
        userId: true,
      },
    });
    if (!members) return null;
    const userIds = members.map((member) => member.userId);
    return userIds;
  }

  async save(member: MemberEntity): Promise<MemberEntity> {
    const createData = MemberMapper.toCreateData(member);
    const prismaMember = await this._prismaClient.member.create({
      data: createData,
    });

    return MemberMapper.toPersistEntity(prismaMember);
  }

  async findByProjectIdAndUserId(
    projectId: number,
    userId: number
  ): Promise<MemberEntity | null> {
    const prismaMember = await this._prismaClient.member.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    });
    if (!prismaMember) {
      return null;
    }
    return MemberMapper.toPersistEntity(prismaMember);
  }

  async delete(projectId: number, userId: number): Promise<void> {
    const result = await this._prismaClient.member.deleteMany({
      where: {
        projectId: projectId,
        userId: userId,
      },
    });
  }

  async getRoleById(
    projectId: number,
    userId: number
  ): Promise<MemberRole | null> {
    const member = await this._prismaClient.member.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
      select: {
        role: true,
      },
    });
    if (!member) {
      return null;
    }
    return member.role;
  }
}
