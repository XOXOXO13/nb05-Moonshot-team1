import { AxiosError } from "axios";
import { axios } from "./axios";
import {
  PaginationResponse,
  FindMyTasksQuery,
} from "@/types/pagination";
import {
  Comment,
  Project,
  ProjectWithCounts,
  SubTask,
  Task,
  UpdateTaskPayload,
  User,
  UserWithCounts,
} from "@/types/entities";
import { TaskStatus } from "@/types/TaskStatus";

const logError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const response = error.response;
    if (response) {
      console.log(
        `[프론트] ${response.config.method?.toUpperCase()} ${
          response.config.url
        } ${response.status}`,
      );
      console.log(response.data);
    }
  }
};

export const login = async (payload: { email: string; password: string }) => {
  try {
    const response = await axios.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "로그인 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const register = async (payload: {
  email: string;
  password: string;
  name: string;
  profileImage: string | null;
}) => {
  try {
    const response = await axios.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "회원가입 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const refreshToken = async (refreshToken: string | null) => {
  try {
    const response = await axios.post("/auth/refresh", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "토큰 갱신 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const getMe = async (): Promise<User> => {
  try {
    const response = await axios.get("/users/me");
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "내 정보 조회 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const updateMe = async (payload: {
  name?: string;
  profileImage?: string | null;
  currentPassword?: string;
  newPassword?: string;
}): Promise<User> => {
  try {
    const response = await axios.patch("/users/me", payload);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "내 정보 수정 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const getMyProjectsWithCounts = async ({
  orderBy,
  order,
}: {
  orderBy?: "created_at" | "name";
  order?: "asc" | "desc";
}): Promise<PaginationResponse<ProjectWithCounts>> => {
  try {
    const response = await axios.get("/users/me/projects", {
      params: {
        order_by: orderBy,
        order,
      },
    });
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ??
          "내 프로젝트 조회 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const createProject = async (payload: {
  name: string;
  description: string;
}): Promise<Project> => {
  try {
    const response = await axios.post("/projects", payload);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "프로젝트 생성 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const getProjectById = async (projectId: number): Promise<Project> => {
  try {
    const response = await axios.get(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "프로젝트 조회 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const updateProject = async (
  projectId: number,
  payload: {
    name?: string;
    description?: string;
  },
): Promise<Project> => {
  const response = await axios.patch(`/projects/${projectId}`, payload);
  return response.data;
};

export const deleteProject = async (projectId: number) => {
  await axios.delete(`/projects/${projectId}`);
};

export interface GetProjectUsersParams {
  page?: number;
  limit?: number;
}

export const getProjectUsers = async (
  projectId: number,
  params: GetProjectUsersParams,
): Promise<PaginationResponse<UserWithCounts>> => {
  try {
    const response = await axios.get(`/projects/${projectId}/users`, {
      params,
    });
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ??
          "프로젝트 사용자 조회 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const inviteMember = async (projectId: number, email: string) => {
  try {
    await axios.post(`/projects/${projectId}/invitations`, { email });
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "멤버 초대 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const removeMember = async (projectId: number, userId: number) => {
  try {
    await axios.delete(`/projects/${projectId}/users/${userId}`);
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "멤버 제외 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export interface GetTasksByProjectIdParams {
  order_by?: "created_at" | "end_date" | "title";
  status?: TaskStatus;
  assignee?: number;
  from?: Date;
  to?: Date;
  keyword?: string;
  page?: number;
  limit?: number;
}

export const getTasksByProjectId = async (
  projectId: number,
  params: GetTasksByProjectIdParams,
): Promise<PaginationResponse<Task>> => {
  try {
    const response = await axios.get(`/projects/${projectId}/tasks`, {
      params,
    });
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "프로젝트 조회 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const createTask = async (payload: {
  projectId: number;
  title: string;
  description: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  tags: string[];
  attachments: string[];
}): Promise<Task> => {
  const { projectId, ...rest } = payload;
  try {
    const response = await axios.post(`/projects/${projectId}/tasks`, rest);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "할 일 생성 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const getTaskById = async (taskId: number): Promise<Task> => {
  try {
    const response = await axios.get(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "할 일 조회 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const updateTask = async (
  taskId: number,
  payload: UpdateTaskPayload,
) => {
  try {
    const response = await axios.patch(`/tasks/${taskId}`, payload);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "할 일 수정 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const deleteTask = async (taskId: number) => {
  await axios.delete(`/tasks/${taskId}`);
};

export const getSubTasksByTaskId = async (
  taskId: number,
): Promise<SubTask[]> => {
  try {
    const response = await axios.get(`/tasks/${taskId}/subtasks`);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ??
          "하위 할 일 목록 조회 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const createSubTask = async (
  taskId: number,
  payload: {
    title: string;
  },
) => {
  try {
    const response = await axios.post(`/tasks/${taskId}/subtasks`, payload);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ??
          "하위 할 일 생성 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const updateSubTask = async (
  subtaskId: number,
  payload: {
    title?: string;
    status?: TaskStatus;
  },
) => {
  try {
    const response = await axios.patch(`/subtasks/${subtaskId}`, payload);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ??
          "하위 할 일 수정 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const deleteSubtask = async (subtaskId: number) => {
  try {
    await axios.delete(`/subtasks/${subtaskId}`);
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ??
          "하위 할 일 삭제 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const getCommentsByTaskId = async (
  taskId: number,
): Promise<Comment[]> => {
  try {
    const response = await axios.get(`/tasks/${taskId}/comments`);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "댓글 조회 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const createComment = async (
  taskId: number,
  payload: {
    content: string;
  },
) => {
  try {
    const response = await axios.post(`/tasks/${taskId}/comments`, payload);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "댓글 생성 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const updateComment = async (
  commentId: number,
  payload: {
    content: string;
  },
) => {
  try {
    const response = await axios.patch(`/comments/${commentId}`, payload);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "댓글 수정 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const deleteComment = async (commentId: number) => {
  try {
    await axios.delete(`/comments/${commentId}`);
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "댓글 삭제 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const getMyTasks = async (params: FindMyTasksQuery): Promise<Task[]> => {
  try {
    const response = await axios.get("/users/me/tasks", {
      params,
    });
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "할 일 조회 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const uploadFiles = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  try {
    const response = await axios.postForm("/files", formData);
    return response.data;
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "파일 업로드 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};

export const removeInvitation = async (invitationId: string) => {
  try {
    await axios.delete(`/invitations/${invitationId}`);
  } catch (error) {
    logError(error);
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data.message ?? "초대 취소 중 오류가 발생했습니다.",
      );
    }
    throw error;
  }
};
