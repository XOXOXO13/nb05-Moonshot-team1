import { MemberEntity } from "../../entites/member/member-entity";

export interface IMemberRepository{
  save(member: MemberEntity): Promise<MemberEntity>;
  findByProjectIdAndUserId(projectId: number, userId:number): Promise<MemberEntity | null>;
  delete(token: string, userId: number): Promise<void>;
}