import { z } from "zod";

// 세부 세부 할 일 생성
export const createSubTaskBodySchema = z.object({
  title: z.string(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
});

export const createSubTaskParamsSchema = z.object({
  taskId: z.coerce.number(),
});

export type CreateSubTaskDto = z.infer<typeof createSubTaskBodySchema> &
  z.infer<typeof createSubTaskParamsSchema> & {
    userId: number;
  };

// 세부 할 일 목록 조회
export const subTaskQuerySchema = z.object({
  page: z.coerce.number().gt(0).optional().default(1),
  limit: z.coerce.number().gt(1).optional().default(10),
});

export const subTaskParamsSchema = z.object({
  taskId: z.coerce.number(),
});

export type SubTasksDto = z.infer<typeof subTaskQuerySchema> &
  z.infer<typeof subTaskParamsSchema> & {
    userId: number;
  };

// 세부 할 일 조회 (개별 세부 할 일 상세조회)
export const subTaskInfoParamsSchema = z.object({
  subtaskId: z.coerce.number(),
});

export type SubTaskDto = z.infer<typeof subTaskInfoParamsSchema> & {
  userId: number;
};

// 세부 할 일 수정
export const updateSubTaskBodySchema = z.object({
  title: z.string().default(""),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
});

export const updateSubTaskParamsSchema = z.object({
  subtaskId: z.coerce.number(),
});

export type UpdateSubTaskDto = z.infer<typeof updateSubTaskBodySchema> &
  z.infer<typeof updateSubTaskParamsSchema> & {
    userId: number;
  };

// 세부 할 일 삭제
export const deleteSubTaskParamsSchema = z.object({
  subtaskId: z.coerce.number(),
});

export type DeleteSubTaskDto = z.infer<typeof deleteSubTaskParamsSchema> & {
  userId: number;
};
