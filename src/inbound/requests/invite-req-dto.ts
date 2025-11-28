import { MemberRole } from "@prisma/client";

export interface InviteMemberDto {
  projectId: number;
  creatorId: number;
  inviteeId: number;
  inviteeEmail: string;
  role: MemberRole;
  projectName: string;
  inviterRole: MemberRole;
}
