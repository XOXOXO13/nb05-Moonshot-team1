"use server";

import * as api from "@/shared/api";
import ActionResult from "@/nb05-Moonshot-team1/types/ActionResult";
import {
  ProjectWithCounts,
  Task,
  User,
  UserWithCounts,
} from "@/nb05-Moonshot-team1/types/entities";
import {
  FindMyTasksQuery,
  PaginationResponse,
} from "@/nb05-Moonshot-team1/types/pagination";
import { redirect } from "next/navigation";
import { deleteAuthCookies } from "@/shared/auth";

export const getMe = async (): Promise<ActionResult<User>> => {
  try {
    const user = await api.getMe();
    return {
      success: "회원 정보 조회 성공",
      data: user,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "회원 정보 조회 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const getMyProjectsWithCounts = async (): Promise<
  ActionResult<ProjectWithCounts[]>
> => {
  let projects: ProjectWithCounts[];
  try {
    const result = await api.getMyProjectsWithCounts({
      orderBy: "created_at",
      order: "desc",
    });
    projects = result.data;
  } catch {
    return {
      success: null,
      error: "프로젝트 조회 중 오류가 발생했습니다.",
      data: null,
    };
  }
  return {
    success: "프로젝트 조회 성공",
    data: projects,
    error: null,
  };
};

export const getTasksByProjectId = async (
  projectId: number,
  query: api.GetTasksByProjectIdParams,
): Promise<ActionResult<PaginationResponse<Task>>> => {
  try {
    const result = await api.getTasksByProjectId(projectId, query);
    return {
      success: "프로젝트 할 일 조회 성공",
      data: result,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "프로젝트 할 일 조회 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const getMyTasks = async (
  query: FindMyTasksQuery,
): Promise<ActionResult<Task[]>> => {
  try {
    const result = await api.getMyTasks(query);
    return {
      success: "할 일 조회 성공",
      data: result,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "할 일 조회 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const getProjectUsers = async (
  projectId: number,
  params: api.GetProjectUsersParams,
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

export const logout = async (): Promise<ActionResult<void>> => {
  try {
    await deleteAuthCookies();
    redirect("/login");
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "로그아웃 중 오류가 발생했습니다.",
      data: null,
    };
  }
};
