import { MemberRole } from "@prisma/client";
import { MemberEntity } from "../../entities/member/member-entity";

export interface IMemberRepository {
  save(member: MemberEntity): Promise<MemberEntity>;
  findByProjectIdAndUserId(
    projectId: number,
    userId: number,
  ): Promise<MemberEntity | null>;
  delete(projectId: number, userId: number): Promise<void>;
  getProjectMembers(projectId: number, userId: number): Promise<number[] | null>;
  getRoleById(projectId: number, userId: number): Promise<MemberRole | null>;
}
