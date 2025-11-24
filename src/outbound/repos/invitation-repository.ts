import { PrismaClient } from "@prisma/client";
import { BaseRepository } from "./base-repository";
import {
  InvitationEntity,
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
    const createData = InvitationMapper.toCreateData(invitation);

    const prismaInvitation = await this._prismaClient.invitation.create({
      data: createData
    });
    return InvitationMapper.toPersistEntity(prismaInvitation);
  }

  async findByToken(token: string): Promise<InvitationEntity | null>{
    const prismaInvitation = await this._prismaClient.invitation.findUnique({
      where:{token}
    });
    if(!prismaInvitation){
      return null;
    }
    return InvitationMapper.toPersistEntity(prismaInvitation);
  }

  async delete(token:string): Promise<void>{
    await this._prismaClient.invitation.delete({
      where:{token},
    });
  }
}
