import { z } from "zod";

/*
  -- 날짜 제약 조건 -- 
  연도 : 2000 ~ 2100년
  월 : 1 ~ 12월
  일 : 1 ~ 31일

  -- 페이지와 데이터 개수 제약 조건 --  
  page : 최소 1이상  (default : 1)
  limit : 최소 1개 (default : 10)
*/

// 할 일 생성
export const createTaskBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  startYear: z.number().gte(2000).lte(2100), // 2000 ~ 2100년
  startMonth: z.number().gte(1).lte(12), // 1월 ~ 12월
  startDay: z.number().gte(1).lte(31), // 1일 ~ 31일
  endYear: z.number().gte(2000).lte(2100),
  endMonth: z.number().gte(1).lte(12),
  endDay: z.number().gte(1).lte(31),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  tags: z.array(z.string()),
  attachments: z.array(z.string()),
});

export const createTaskParamsSchema = z.object({
  projectId: z.coerce.number(),
});

export type CreateTaskDto = z.infer<typeof createTaskBodySchema> &
  z.infer<typeof createTaskParamsSchema> & {
    userId: number;
  };

// 할 일 조회 (프로젝트)
export const projectTaskQuerySchema = z.object({
  page: z.coerce.number().gt(0).default(1).optional(),
  limit: z.coerce.number().gt(1).default(10).optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  assignee: z.coerce.number().optional(),
  keyword: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("asc").optional(),
  order_by: z
    .enum(["created_at", "title", "end_date"])
    .default("created_at")
    .optional(),
});

export const projectTaskParamsSchema = z.object({
  projectId: z.coerce.number(),
});

export type ProjectTaskDto = z.infer<typeof projectTaskQuerySchema> &
  z.infer<typeof projectTaskParamsSchema> & {
    userId: number;
  };

// 할 일 조회 (개별 할 일 상세조회)
export const taskInfoParamsSchema = z.object({
  taskId: z.coerce.number(),
});

export type TaskDto = z.infer<typeof taskInfoParamsSchema> & {
  userId: number;
};

// 할 일 수정
export const updateTaskBodySchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  startYear: z.number().gte(2000).lte(2100).optional(),
  startMonth: z.number().gte(1).lte(12).optional(),
  startDay: z.number().gte(1).lte(31).optional(),
  endYear: z.number().gte(2000).lte(2100).optional(),
  endMonth: z.number().gte(1).lte(12).optional(),
  endDay: z.number().gte(1).lte(31).optional(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo").optional(),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
});

export const updateTaskParamsSchema = z.object({
  taskId: z.coerce.number(),
});

export type UpdateTaskDto = z.infer<typeof updateTaskBodySchema> &
  z.infer<typeof updateTaskParamsSchema> & {
    userId: number;
  };

// 할 일 삭제
export const deleteTaskParamsSchema = z.object({
  taskId: z.coerce.number(),
});

export type DeleteTaskDto = z.infer<typeof deleteTaskParamsSchema> & {
  userId: number;
};
