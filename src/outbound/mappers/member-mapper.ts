import { Member } from "@prisma/client";
import { MemberData, MemberEntity } from "../../domain/entites/member/member-entity";

export class MemberMapper {
  static toPersistEntity(data: Member): MemberEntity {
    return MemberEntity.createPersist({
      userId: data.userId,
      projectId: data.projectId,
      role: data.role,
      joinedAt: data.joinedAt,
      status: data.status,
      version: 1,
    });
  }

  static toCreateData(entity: MemberEntity): MemberData {
    const data = entity.toData();
    const prismaData = {
      projectId: data.projectId,
      userId: data.userId,
      role: data.role,
      status: data.status,
      joinedAt: data.joinedAt
    };

    return prismaData;
  }
}
