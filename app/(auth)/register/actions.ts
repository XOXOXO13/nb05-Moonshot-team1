"use server";

import * as api from "@/shared/api";
import ActionResult from "@/nb05-Moonshot-team1/types/ActionResult";

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  passwordConfirm: string;
  profileImage: string | null;
}

export const register = async (
  input: RegisterInput,
): Promise<ActionResult<null>> => {
  const { email, password, name, passwordConfirm, profileImage } = input;

  if (String(password) !== String(passwordConfirm)) {
    return {
      error: "비밀번호가 일치하지 않습니다.",
      success: null,
      data: null,
    };
  }

  try {
    await api.register({
      email,
      password,
      name,
      profileImage,
    });
    return {
      success: "회원가입이 완료되었습니다.",
      data: null,
      error: null,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다.",
      success: null,
      data: null,
    };
  }
};
