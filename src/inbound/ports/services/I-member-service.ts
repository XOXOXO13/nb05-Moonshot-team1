import { PaginatedProjectMemberData } from "../../../domain/entities/member/member-entity";

export interface IMemberService {
  getProjectMembers(
    projectId: number,
    userId: number,
    page: number,
    limit: number,
  ): Promise<PaginatedProjectMemberData>;
  deleteMember(
    projectId: number,
    deletedUserId: number,
    deleterId: number,
  ): Promise<void>;
}
