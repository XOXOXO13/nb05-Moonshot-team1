import { MemberEntity } from "../../entites/member/member-entity";

export interface IMemberRepository{
  save(member: MemberEntity): Promise<MemberEntity>;
  findByProjectIdAndUserId(projectId: number, userId:number): Promise<MemberEntity | null>;
  delete(projectId: number, userId: number): Promise<void>;
}