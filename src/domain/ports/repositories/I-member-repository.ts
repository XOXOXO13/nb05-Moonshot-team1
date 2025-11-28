import { MemberRole } from "@prisma/client";
import { MemberEntity, ProjectMemberData } from "../../entities/member/member-entity";

export interface IMemberRepository {
  save(member: MemberEntity): Promise<MemberEntity>;
  findByProjectIdAndUserId(
    projectId: number,
    userId: number,
  ): Promise<MemberEntity | null>;
  delete(projectId: number, userId: number): Promise<void>;
  getProjectMembersId(projectId: number): Promise<number[] | null>;
  getRoleById(projectId: number, userId: number): Promise<MemberRole | null>;
  getProjectMembers(projectId: number, page?:number, limit?:number): Promise<ProjectMemberData[]|null>
}
