import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base-repository";
import {
  InvitationEntity,
  NewInvitationEntity,
  PersistInvitationEntity,
} from "../../domain/entites/member/invitation-entity";
import { InvitationMapper } from "../mappers/invitation-mapper";
import { IInvitationRepository } from "../../domain/ports/repositories/I-invitation-repository";

export class InvitationRepository
  extends BaseRepository
  implements IInvitationRepository
{
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }
  async findByProjectIdAndInviteeId(
    projectId: number,
    inviteeId: number,
  ): Promise<InvitationEntity | null> {
    const prismaInvitation = await this._prismaClient.invitation.findUnique({
      where: {
        projectId_inviteeId: {
          projectId: projectId,
          inviteeId: inviteeId,
        },
      },
    });
    if (!prismaInvitation) {
      return null;
    }

    return InvitationMapper.toPersistEntity(prismaInvitation);
  }

  async save(
    invitation: NewInvitationEntity,
  ): Promise<PersistInvitationEntity> {
    const createData = InvitationMapper.toCreateData(invitation);

    const prismaInvitation = await this._prismaClient.invitation.create({
      data: createData,
    });
    return InvitationMapper.toPersistEntity(prismaInvitation);
  }

  async findByToken(token: string): Promise<InvitationEntity | null> {
    const prismaInvitation = await this._prismaClient.invitation.findUnique({
      where: { token },
    });
    if (!prismaInvitation) {
      return null;
    }
    return InvitationMapper.toPersistEntity(prismaInvitation);
  }

  async delete(token: string): Promise<void> {
    await this._prismaClient.invitation.delete({
      where: { token },
    });
  }
}
