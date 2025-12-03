"use server";

import * as api from "@/shared/api";
import ActionResult from "@/types/ActionResult";
import {
  Comment,
  SubTask,
  Task,
  UpdateTaskPayload,
} from "@/types/entities";
import { TaskStatus } from "@/types/TaskStatus";
import { revalidatePath } from "next/cache";

export const getTaskById = async (
  taskId: number
): Promise<ActionResult<Task>> => {
  try {
    const task = await api.getTaskById(taskId);
    return {
      success: "할 일 조회 성공",
      data: task,
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

export const updateTask = async (
  taskId: number,
  payload: UpdateTaskPayload
): Promise<ActionResult<Task>> => {
  try {
    const task = await api.updateTask(taskId, payload);
    revalidatePath(`/projects/${task.projectId}/tasks`);
    revalidatePath(`/tasks/${taskId}`);
    return {
      success: "할 일 수정 성공",
      data: task,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "할 일 수정 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const deleteTask = async (
  taskId: number
): Promise<ActionResult<null>> => {
  try {
    await api.deleteTask(taskId);
    return {
      success: "할 일 삭제 성공",
      data: null,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "할 일 삭제 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const getSubTasksByTaskId = async (
  taskId: number
): Promise<ActionResult<SubTask[]>> => {
  try {
    const subTasks = await api.getSubTasksByTaskId(taskId);
    return {
      success: "하위 할 일 목록 조회 성공",
      data: subTasks,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "하위 할 일 목록 조회 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const createSubtask = async (
  taskId: number,
  payload: { title: string }
): Promise<ActionResult<SubTask>> => {
  try {
    const subtask = await api.createSubTask(taskId, payload);
    revalidatePath(`/tasks/${taskId}/subtasks`);
    return {
      success: "하위 할 일 생성 성공",
      data: subtask,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "하위 할 일 생성 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const updateSubtask = async (
  taskId: number,
  subtaskId: number,
  payload: { title?: string; status?: TaskStatus }
): Promise<ActionResult<SubTask>> => {
  try {
    const subtask = await api.updateSubTask(subtaskId, payload);
    revalidatePath(`/tasks/${taskId}/subtasks`);
    return {
      success: "하위 할 일 수정 성공",
      data: subtask,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "하위 할 일 수정 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const deleteSubtask = async (
  taskId: number,
  subtaskId: number
): Promise<ActionResult<null>> => {
  try {
    await api.deleteSubtask(subtaskId);
    revalidatePath(`/tasks/${taskId}/subtasks`);
    return {
      success: "하위 할 일 삭제 성공",
      data: null,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "하위 할 일 삭제 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const getCommentsByTaskId = async (
  taskId: number
): Promise<ActionResult<Comment[]>> => {
  try {
    const comments = await api.getCommentsByTaskId(taskId);
    return {
      success: "댓글 목록 조회 성공",
      data: comments,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "댓글 목록 조회 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const createComment = async (
  taskId: number,
  payload: { content: string }
): Promise<ActionResult<Comment>> => {
  try {
    const comment = await api.createComment(taskId, payload);
    revalidatePath(`/tasks/${taskId}/comments`);
    return {
      success: "댓글 생성 성공",
      data: comment,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "댓글 생성 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const updateComment = async (
  taskId: number,
  commentId: number,
  payload: { content: string }
): Promise<ActionResult<Comment>> => {
  try {
    const comment = await api.updateComment(commentId, payload);
    revalidatePath(`/tasks/${taskId}/comments`);
    return {
      success: "댓글 수정 성공",
      data: comment,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "댓글 수정 중 오류가 발생했습니다.",
      data: null,
    };
  }
};

export const deleteComment = async (
  taskId: number,
  commentId: number
): Promise<ActionResult<null>> => {
  try {
    await api.deleteComment(commentId);
    revalidatePath(`/tasks/${taskId}/comments`);
    return {
      success: "댓글 삭제 성공",
      data: null,
      error: null,
    };
  } catch (error) {
    return {
      success: null,
      error:
        error instanceof Error
          ? error.message
          : "댓글 삭제 중 오류가 발생했습니다.",
      data: null,
    };
  }
};
