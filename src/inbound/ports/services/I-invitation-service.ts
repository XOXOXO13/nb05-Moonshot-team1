import { MemberRole } from "@prisma/client";
import { PersistInvitationEntity } from "../../../domain/entities/member/invitation-entity";
import { MemberEntity } from "../../../domain/entities/member/member-entity";

export interface IInvitationService {
  inviteMember(projectId: number, invitorId: number): Promise<string>;
  acceptInvitation(token: string, userId: number): Promise<void>;
  deleteInvitation(token: string, creatorId: number): Promise<void>;
}
