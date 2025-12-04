import { BasePrismaClient, BaseRepository } from "./base-repository";
import { InvitationEntity } from "../../domain/entities/member/invitation-entity";
import { InvitationMapper } from "../mappers/invitation-mapper";
import { IInvitationRepository } from "../../domain/ports/repositories/I-invitation-repository";
import {
  TechnicalException,
  TechnicalExceptionType,
} from "../../shared/exceptions/technical.exception";

export class InvitationRepository
  extends BaseRepository
  implements IInvitationRepository
{
  constructor(prismaClient: BasePrismaClient) {
    super(prismaClient);
  }

  async createInviteCode(
    projectId: number,
    invitorId: number,
    inviteeEmail: string,
  ): Promise<string> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    const invitee = await this._prismaClient.user.findUnique({
      where: {
        email: inviteeEmail,
      },
    });

    if (!invitee) {
      throw new TechnicalException({
        type: TechnicalExceptionType.DB_QUERY_FAILED,
      });
    }
    const inviteToken = await this._prismaClient.invitation.create({
      data: {
        projectId: projectId,
        invitorId: invitorId,
        inviteeId: invitee.id,
        expiresAt: expirationDate,
      },
      select: {
        token: true,
      },
    });

    await this._prismaClient.member.create({
      data: {
        userId: invitee.id,
        projectId: projectId,
        role: "MEMBER",
      },
    });

    return inviteToken.token;
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

  async save(token: string, userId: number): Promise<void> {
    const invitation = await this._prismaClient.invitation.findUnique({
      where: {
        token,
      },
    });
    if (!invitation) {
      return;
    }
    const projectId = invitation?.projectId;
    await this._prismaClient.member.create({
      data: {
        projectId: projectId,
        userId: userId,
        role: "MEMBER",
        status: "ACTIVE",
        joinedAt: new Date(),
      },
    });

    await this._prismaClient.invitation.delete({
      where: {
        token,
      },
    });
  }

  async findByToken(token: string): Promise<boolean> {
    const prismaInvitation = await this._prismaClient.invitation.findUnique({
      where: { token },
      select: {
        projectId: true,
        expiresAt: true,
      },
    });
    if (!prismaInvitation) {
      return false;
    }
    return true;
  }

  async delete(token: string): Promise<void> {
    await this._prismaClient.invitation.delete({
      where: { token },
    });
  }

  async getProjectIdByToken(token: string): Promise<number | null> {
    const invite = await this._prismaClient.invitation.findUnique({
      where: {
        token,
      },
      select: {
        projectId: true,
      },
    });
    return invite ? invite.projectId : null;
  }
}
