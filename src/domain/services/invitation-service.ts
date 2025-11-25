import { MemberRole } from "@prisma/client";
import { UnitOfWork } from "../../outbound/unit-of-work";
import { PersistInvitationEntity } from "../entites/member/invitation-entity";
import { IRepositories } from "../ports/repositories/I-repositories";
import { InvitationEntity } from "../entites/member/invitation-entity";
import { v4 as uuidv4 } from "uuid";
import { MemberEntity } from "../entites/member/member-entity";
import { IInvitationService } from "../../inbound/ports/services/I-invitation-service";
import { IEmailService } from "../../inbound/ports/services/I-email-service";

export class InvitationService implements IInvitationService {
  private readonly _unitOfWork;
  private _emailService: IEmailService;

  constructor(unitOfWork: UnitOfWork, emailService: IEmailService) {
    this._unitOfWork = unitOfWork;
    this._emailService = emailService;
  }

  async inviteMember(
    projectId: number,
    creatorId: number,
    inviteeId: number,
    inviteeEmail: string,
    role: MemberRole,
    projectName: string,
    inviterRole: MemberRole,
  ): Promise<PersistInvitationEntity> {
    return this._unitOfWork.do(
      async (repos: IRepositories) => {
        if (inviterRole !== MemberRole.OWNER) {
          // 권한 없음 에러
          throw new Error();
        }
        if (creatorId === inviteeId) {
          // 자기 자신 초대 불가
          throw new Error();
        }
        const existingMember =
          await repos.memberRepository.findByProjectIdAndUserId(
            projectId,
            inviteeId,
          );
        if (existingMember) {
          // 이미 초대된 멤버 초대 불가
          throw new Error();
        }
        const existingInvitation =
          await repos.invitationRepository.findByProjectIdAndInviteeId(
            projectId,
            inviteeId,
          );

        if (existingInvitation) {
          // 중복 초대 불가
          throw new Error();
        }

        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const newInvitation = InvitationEntity.createNew({
          token,
          projectId,
          creatorId,
          inviteeId,
          role,
          expiresAt,
        });

        const savedInvitation =
          await repos.invitationRepository.save(newInvitation);
        const invitationLink = `https://localhost:4000/invite?token=${savedInvitation.token}`;
        try {
          await this._emailService.sendInvitation(
            inviteeEmail,
            invitationLink,
            projectName,
          );
        } catch (err) {
          throw new Error();
        }

        return savedInvitation;
      },
      true,
      "Serializable",
    );
  }

  async acceptInvitation(token: string, userId: number): Promise<MemberEntity> {
    return this._unitOfWork.do(
      async (repos: IRepositories) => {
        const invitation = await repos.invitationRepository.findByToken(token);
        if (!invitation) {
          // invalid invitation
          throw new Error();
        }

        const invitationData = invitation.toData();
        if (invitationData.expiresAt.getTime() < Date.now()) {
          await repos.invitationRepository.delete(token);
          // invalid invitation
          throw new Error();
        }

        const existingMember =
          await repos.memberRepository.findByProjectIdAndUserId(
            invitationData.projectId,
            userId,
          );
        if (existingMember) {
          await repos.invitationRepository.delete(token);
          // 초대장만 삭제하고 이미 초대된 멤버 에러처리
          throw new Error();
        }

        const newMember = MemberEntity.createNewInvited({
          userId,
          projectId: invitationData.projectId,
          role: invitation.role,
        });

        const savedMember = await repos.memberRepository.save(newMember);
        await repos.invitationRepository.delete(token);
        return savedMember;
      },
      true,
      "Serializable",
    );
  }

  async deleteInvitation(token: string, creatorId: number): Promise<void> {
    await this._unitOfWork.do(
      async (repos: IRepositories) => {
        const invitation = await repos.invitationRepository.findByToken(token);

        if (!invitation) {
          return;
        }
        await repos.invitationRepository.delete(token);
      },
      false,
      "ReadCommitted",
    );
  }
}
