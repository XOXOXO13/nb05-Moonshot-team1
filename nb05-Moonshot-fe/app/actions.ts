"use server";

import ActionResult from "@/types/ActionResult";
import * as api from "@/shared/api";

export const uploadFiles = async (
  files: File[]
): Promise<ActionResult<string[]>> => {
  try {
    const urls = await api.uploadFiles(files);
    return {
      error: null,
      success: "파일 업로드 성공",
      data: urls,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "오류가 발생했습니다.",
      success: null,
      data: null,
    };
  }
};
