import { Invitation, MemberRole } from "@prisma/client";
import {
  InvitationData,
  NewInvitationEntity,
  PersistInvitationEntity,
} from "../../domain/entities/member/invitation-entity";
import { InvitationEntity } from "../../domain/entities/member/invitation-entity";

export class InvitationMapper {
  static toPersistEntity = (data: Invitation): PersistInvitationEntity => {
    const role: MemberRole = data.role;

    return InvitationEntity.createPersist({
      token: data.token,
      projectId: data.projectId,
      inviteeId: data.inviteeId,
      creatorId: data.creatorId,
      expiresAt: data.expiresAt,
      createdAt: data.createdAt,
      updatedAt: data.createdAt,
      version: 1,
      role: role,
    });
  };

  static toCreateData(
    entity: NewInvitationEntity,
  ): Omit<InvitationData, "version"> {
    const data = entity.toData();

    const prismaData = {
      token: data.token,
      projectId: data.projectId,
      inviteeId: data.inviteeId,
      creatorId: data.creatorId,
      expiresAt: data.expiresAt,
      role: data.role,
    };

    return prismaData;
  }
}
