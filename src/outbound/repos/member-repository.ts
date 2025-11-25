import { MemberRole } from "@prisma/client";
import { MemberEntity } from "../../domain/entites/member/member-entity";
import { UserEntity } from "../../domain/entites/user/user-entity";
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
    userId: number
  ): Promise<number[] | null> {
    const members = await this._prismaClient.member.findMany({
      where: {
        projectId: projectId,
      },
      select: {
        userId: true,
      },
    });
    const userIds = members.map((member) => member.userId);
    const isUserIncluded = userIds.includes(userId);
    if (isUserIncluded) {
      return userIds;
    }

    return null;
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

  async getRoleById(projectId: number, userId: number): Promise<MemberRole | null>{
    const member = await this._prismaClient.member.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
      select:{
        role: true,
      }
    });
    if(!member){
      return null;
    }
    return member.role;
  }
}
