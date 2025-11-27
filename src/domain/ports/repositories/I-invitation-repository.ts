import {
  InvitationEntity,
  NewInvitationEntity,
  PersistInvitationEntity,
} from "../../entities/member/invitation-entity";

export interface IInvitationRepository {
  save(invitation: NewInvitationEntity): Promise<PersistInvitationEntity>;
  findByToken(token: string): Promise<InvitationEntity | null>;
  findByProjectIdAndInviteeId(
    projectId: number,
    userId: number,
  ): Promise<InvitationEntity | null>;
  delete(token: string): Promise<void>;
}
