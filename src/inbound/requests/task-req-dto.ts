import { z } from "zod";

export const createTaskReqSchema = z.object({
  body: z.object({
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
    assigneeId: z.number(),
  }),
  params: z.object({
    projectId: z.coerce.number().int(),
  }),
  headers: z.object({
    authorization: z.string(),
  }),
});

export const updateTaskReqSchema = z.object({
  body: z.object({
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
    assigneeId: z.number(),
  }),
  params: z.object({
    taskId: z.coerce.number().int(),
  }),
  headers: z.object({
    authorization: z.string(),
  }),
});

export const viewProjectTaskReqSchema = z.object({
  headers: z.object({
    authorization: z.string(),
  }),

  query: z
    .object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      status: z.enum(["todo", "in_progress", "done"]).optional(),
      assignee: z.coerce.number().optional(),
      keyword: z.string().optional(),
      order: z.enum(["asc", "desc"]).optional(),
      order_by: z.enum(["created_at", "name", "end_date"]).optional(),
    })
    .optional(),
  params: z.object({
    projectId: z.coerce.number(),
  }),
});

export const viewTaskInfoReqSchema = z.object({
  headers: z.object({
    authorization: z.string(),
  }),
  params: z.object({
    taskId: z.coerce.number(),
  }),
});

export type CreateTaskReqDto = z.infer<typeof createTaskReqSchema>;
export type UpdateTaskReqDto = z.infer<typeof updateTaskReqSchema>;
export type ProjectTaskReqDto = z.infer<typeof viewProjectTaskReqSchema>;
export type TaskInfoReqDto = z.infer<typeof viewTaskInfoReqSchema>;
