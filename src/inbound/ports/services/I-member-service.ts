import { MemberEntity } from "../../../domain/entites/member/member-entity";

export interface IMemberService {
  getProjectMembers(
    projectId: number,
    userId: number
  ): Promise<number[] | null>;
  deleteMember(
    projectId: number,
    deletedUserId: number,
    deleterId: number
  ): Promise<void>;
}
