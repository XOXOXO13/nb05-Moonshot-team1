import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base-repository";
import {
  NewInvitationEntity,
  PersistInvitationEntity,
} from "../../domain/entites/member/invitation-entity";
import { InvitationMapper } from "../mappers/invitation-mapper";

export class InvitationRepository extends BaseRepository {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }

  async save(
    invitation: NewInvitationEntity
  ): Promise<PersistInvitationEntity> {
    const data = invitation.toData();
    const prismaInvitation = this._prismaClient.invitation.create({
      data,
    });
    return InvitationMapper.toPersistEntity({...prismaInvitation})
  }
}
