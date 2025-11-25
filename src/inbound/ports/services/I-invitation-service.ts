import { MemberRole } from "@prisma/client";
import { PersistInvitationEntity } from "../../../domain/entites/member/invitation-entity";
import { MemberEntity } from "../../../domain/entites/member/member-entity";

export interface IInvitationService {
  inviteMember(
    projectId: number,
    creatorId: number,
    inviteeId: number,
    inviteeEmail: string,
    role: MemberRole,
    projectName: string,
    inviterRole: MemberRole,
  ): Promise<PersistInvitationEntity>;
  acceptInvitation(token: string, userId: number): Promise<MemberEntity>;
  deleteInvitation(token: string, creatorId: number): Promise<void>;
}
