import { z } from "zod";

export const getUserTasksReqSchema = z.object({
  headers: z.object({
    authorization: z.string(),
  }),
  query: z
    .object({
      from: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
      to: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
      project_id: z.coerce.number().optional(),
      status: z.enum(["todo", "in_progress", "done"]).optional(),
      assignee_id: z.coerce.number().optional(),
      keyword: z.string().optional(),
    })
    .optional(),
});

export type GetUserTasksReqDto = z.infer<typeof getUserTasksReqSchema>;

export interface GetUserTasksQueryParams {
  from: string | null;
  to: string | null;
  projectId: number | null;
  status: string | null;
  assigneeId: number | null;
  keyword: string | null;
}
