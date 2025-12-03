"use server";

import * as api from "@/shared/api";
import ActionResult from "@/types/ActionResult";
import { UserWithCounts } from "@/types/entities";
import { PaginationResponse } from "@/types/pagination";
import { revalidatePath } from "next/cache";

export const getProjectUsers = async (
  projectId: number,
  params: api.GetProjectUsersParams
): Promise<ActionResult<PaginationResponse<UserWithCounts>>> => {
  try {
    const data = await api.getProjectUsers(projectId, params);
    return {
      success: "프로젝트 사용자 조회 성공",
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "프로젝트 사용자 조회 중 오류가 발생했습니다.",
    };
  }
};

export const removeMember = async (
  projectId: number,
  userId: number
): Promise<ActionResult<null>> => {
  try {
    await api.removeMember(projectId, userId);
    return {
      success: "멤버 제외 성공",
      data: null,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "멤버 제외 중 오류가 발생했습니다.",
    };
  }
};

export const removeInvitation = async (
  projectId: number,
  invitationId: string
): Promise<ActionResult<null>> => {
  try {
    await api.removeInvitation(invitationId);
    revalidatePath(`/projects/${projectId}/members`);
    return {
      success: "초대 취소 성공",
      data: null,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "초대 취소 중 오류가 발생했습니다.",
    };
  }
};
