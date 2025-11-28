import { MemberRole } from "@prisma/client";
import { UnitOfWork } from "../../outbound/unit-of-work";
import { PersistInvitationEntity } from "../entities/member/invitation-entity";
import { IRepositories } from "../ports/repositories/I-repositories";
import { InvitationEntity } from "../entities/member/invitation-entity";
import { v4 as uuidv4 } from "uuid";
import { MemberEntity } from "../entities/member/member-entity";
import { IInvitationService } from "../../inbound/ports/services/I-invitation-service";
import { IEmailService } from "../../inbound/ports/services/I-email-service";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../shared/exceptions/business-exception";

export class InvitationService implements IInvitationService {
  private readonly _unitOfWork;
  private _emailService: IEmailService;

  constructor(unitOfWork: UnitOfWork, emailService: IEmailService) {
    this._unitOfWork = unitOfWork;
    this._emailService = emailService;
  }

  async inviteMember(projectId: number, invitorId: number): Promise<string> {
    const projectMembers =
      await this._unitOfWork.repos.memberRepository.getProjectMembersId(
        projectId
      );

    if (!projectMembers?.includes(invitorId)) {
      throw new BusinessException({
        type: BusinessExceptionType.NOT_MEMBER,
      });
    }

    return await this._unitOfWork.repos.invitationRepository.createInviteCode(
      projectId,
      invitorId
    );
  }

  async acceptInvitation(token: string, userId: number): Promise<void> {
    return this._unitOfWork.do(
      async (repos: IRepositories) => {
        const invitation = await repos.invitationRepository.findByToken(token);
        if (!invitation) {
          throw new BusinessException({
            type: BusinessExceptionType.INVALID_TOKEN,
          });
        }

        return await repos.invitationRepository.save(token, userId);
      },
      true,
      "Serializable"
    );
  }

  async deleteInvitation(token: string, userID: number): Promise<void> {
    await this._unitOfWork.do(
      async (repos: IRepositories) => {
        const invitation = await repos.invitationRepository.findByToken(token);
        if (!invitation) {
          throw new BusinessException({
            type: BusinessExceptionType.INVALID_TOKEN,
          });
        }
        const projectId = Number(
          await repos.invitationRepository.getProjectIdByToken
        );

        const role = await repos.memberRepository.getRoleById(
          projectId,
          userID
        );
        if (role !== "OWNER") {
          throw new BusinessException({
            type: BusinessExceptionType.INVALID_AUTH,
          });
        }
        await repos.invitationRepository.delete(token);
      },
      false,
      "ReadCommitted"
    );
  }
}
