"use server";

import { revalidatePath } from "next/cache";
import ActionResult from "@/nb05-Moonshot-team1/types/ActionResult";
import { User } from "@/nb05-Moonshot-team1/types/entities";
import * as api from "@/shared/api";

export const updateMe = async (payload: {
  name?: string;
  profileImage?: string | null;
  currentPassword?: string;
  newPassword?: string;
}): Promise<ActionResult<User>> => {
  try {
    const user = await api.updateMe(payload);
    revalidatePath("/users/me");
    return { error: null, success: "내 정보 수정 성공", data: user };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, success: null, data: null };
    }
    return {
      error: "내 정보 수정 중 오류가 발생했습니다.",
      success: null,
      data: null,
    };
  }
};
