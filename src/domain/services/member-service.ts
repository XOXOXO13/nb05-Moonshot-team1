import { IMemberService } from "../../inbound/ports/services/I-member-service";
import { UnitOfWork } from "../../outbound/unit-of-work";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../shared/exceptions/business-exception";
import { PaginatedProjectMemberData } from "../entities/member/member-entity";

export class MemberService implements IMemberService {
  private readonly _unitOfWokr;

  constructor(unitOfWork: UnitOfWork) {
    this._unitOfWokr = unitOfWork;
  }

  // 낙관적락 불필요
  async getProjectMembers(
    projectId: number,
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedProjectMemberData> {
    const members =
      await this._unitOfWokr.repos.memberRepository.getProjectMembers(
        projectId,
        page,
        limit,
      );
    return {
      data: members,
      total: members?.length,
    } as PaginatedProjectMemberData;
  }

  async deleteMember(
    projectId: number,
    deletedUserId: number,
    deleterId: number,
  ): Promise<void> {
    return await this._unitOfWokr.do(async (repos) => {
      const deleter = await repos.memberRepository.getRoleById(
        projectId,
        deleterId,
      );

      if (deleter !== "OWNER") {
        throw new Error();
      }
      await repos.memberRepository.delete(projectId, deletedUserId);
    });
  }
}
