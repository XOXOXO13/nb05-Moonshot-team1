"use server";

import * as api from "@/shared/api";
import ActionResult from "@/nb05-Moonshot-team1/types/ActionResult";
import {
  Project,
  ProjectWithCounts,
} from "@/nb05-Moonshot-team1/types/entities";
import { revalidatePath } from "next/cache";

export interface CreateProjectInput {
  name: string;
  description: string;
}

export const getMyProjectsWithCounts = async ({
  sort = "latest",
}: {
  sort?: "latest" | "name";
}): Promise<ActionResult<ProjectWithCounts[] | null>> => {
  let projectsWithCounts: ProjectWithCounts[] = [];
  try {
    const result = await api.getMyProjectsWithCounts({
      orderBy: sort === "latest" ? "created_at" : "name",
      order: sort === "latest" ? "desc" : "asc",
    });
    projectsWithCounts = result.data;
  } catch {
    return {
      error: "프로젝트 조회 중 오류가 발생했습니다.",
      data: null,
      success: null,
    };
  }

  return {
    success: "프로젝트 조회 중 오류가 발생했습니다.",
    data: projectsWithCounts,
    error: null,
  };
};

export const createProject = async (
  payload: CreateProjectInput,
): Promise<ActionResult<Project | null>> => {
  let project: Project | null = null;
  try {
    project = await api.createProject(payload);
    revalidatePath("/users/me/projects");
  } catch {
    return {
      error: "프로젝트 생성 중 오류가 발생했습니다.",
      data: null,
      success: null,
    };
  }

  return {
    success: "프로젝트가 생성되었습니다.",
    data: project,
    error: null,
  };
};
