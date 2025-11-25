import { z } from "zod";


// 할 일 생성
export const createTaskBodySchema = z.object({
  title: z.string(),
  startYear: z.number(),
  startMonth: z.number(),
  startDay: z.number(),
  endYear: z.number(),
  endMonth: z.number(),
  endDay: z.number(),
  status: z.enum(["todo", "in_progress", "done"]),
  tags: z.array(z.string()),
  attachments: z.array(z.string()),
});

export const createTaskParamsSchema = z.object({
  projectId: z.coerce.number()
})

export type CreateTaskDto =
  z.infer<typeof createTaskBodySchema> &
  z.infer<typeof createTaskParamsSchema> & {
    userId: number
  };

  

// 할 일 조회 (프로젝트)
export const projectTaskQuerySchema = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
  assignee: z.coerce.number().optional(),
  keyword: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  order_by: z.enum(["created_at", "name", "end_date"]).optional(),
})

export const projectTaskParamsSchema = z.object({
  projectId: z.coerce.number(),
})


export type ProjectTaskDto =
  z.infer<typeof projectTaskQuerySchema> &
  z.infer<typeof projectTaskParamsSchema> &
  {
    userId: number
  };


// 할 일 조회 (개별 할 일 상세조회)
export const taskInfoParamsSchema = z.object({
  taskId: z.coerce.number(),
});

export type TaskDto =
  z.infer<typeof taskInfoParamsSchema> &
  {
    userId: number
  }




// 할 일 수정
export const updateTaskBodySchema = z.object({
  title: z.string(),
  startYear: z.number(),
  startMonth: z.number(),
  startDay: z.number(),
  endYear: z.number(),
  endMonth: z.number(),
  endDay: z.number(),
  status: z.enum(["todo", "in_progress", "done"]),
  assigneeId: z.number(),
  tags: z.array(z.string()),
  attachments: z.array(z.string()),
});

export const updateTaskParamsSchema = z.object({
  taskId: z.coerce.number()
})

export type UpdateTaskDto =
  z.infer<typeof updateTaskBodySchema> &
  z.infer<typeof updateTaskParamsSchema> & {
    userId: number;
  }




// 할 일 삭제 
export const deleteTaskParamsSchema = z.object({
  taskId: z.coerce.number()
});

export type DeleteTaskDto =
  z.infer<typeof deleteTaskParamsSchema> &
  {
    userId: number;
  }