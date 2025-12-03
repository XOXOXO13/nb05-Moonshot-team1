import {
  InvitationEntity,
} from "../../entities/member/invitation-entity";

export interface IInvitationRepository {
  createInviteCode(projectId: number, invitorId: number, inviteeEmail: string): Promise<string>;
  save(token: string, userId: number): Promise<void>;
  findByToken(token: string): Promise<boolean>;
  findByProjectIdAndInviteeId(
    projectId: number,
    userId: number,
  ): Promise<InvitationEntity | null>;
  delete(token: string): Promise<void>;
  getProjectIdByToken(token: string): Promise<number | null>;
}
