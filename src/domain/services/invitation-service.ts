import { UnitOfWork } from "../../outbound/unit-of-work";
import { IRepositories } from "../ports/repositories/I-repositories";
import { IInvitationService } from "../../inbound/ports/services/I-invitation-service";
import { Email } from "../../outbound/email";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../shared/exceptions/business-exception";

export class InvitationService implements IInvitationService {
  private readonly _unitOfWork;
  private _emailService: Email;
  private readonly _baseUrl: string;

  constructor(
    unitOfWork: UnitOfWork,
    emailService: Email,
    baseUrl: string = "http://localhost:3001/invitations" // 실제 프론트엔드 url 로 변경해야함.
  ) {
    this._unitOfWork = unitOfWork;
    this._emailService = emailService;
    this._baseUrl = baseUrl;
  }

  async inviteMember(
    projectId: number,
    invitorId: number,
    inviteeEmail: string
  ): Promise<string> {
    const projectMembers =
      await this._unitOfWork.repos.memberRepository.getProjectMembersId(
        projectId
      );
    const project =
      await this._unitOfWork.repos.projectRepository.findById(projectId);
    if (!project) {
      throw new BusinessException({
        type: BusinessExceptionType.INVALID_PROJECTID,
      });
    }
    const projectName = project?.name;

    if (!projectMembers?.includes(invitorId)) {
      throw new BusinessException({
        type: BusinessExceptionType.NOT_MEMBER,
      });
    }
    const token =
      await this._unitOfWork.repos.invitationRepository.createInviteCode(
        projectId,
        invitorId,
        inviteeEmail,
      );
    const invitationLink = `${this._baseUrl}/${token}/accept`;
    this._emailService.sendInvitation(
      inviteeEmail,
      invitationLink,
      projectName
    );
    return token;
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
