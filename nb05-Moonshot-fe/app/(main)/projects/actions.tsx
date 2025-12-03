import * as api from "@/nb05-Moonshot-fe/shared/api";
import { Project } from "@/nb05-Moonshot-team1/types/entities";
import ActionResult from "@/nb05-Moonshot-team1/types/ActionResult";

export const getProjectById = async (
  projectId: number
): Promise<ActionResult<Project>> => {
  try {
    const project = await api.getProjectById(projectId);
    return {
      success: "프로젝트 조회 성공",
      data: project,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "프로젝트 조회 중 오류가 발생했습니다.",
      data: null,
    };
  }
};
