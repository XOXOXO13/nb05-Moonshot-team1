import { z } from "zod";

export const taskReqSchema = z.object({
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

export type TaskReqDto = z.infer<typeof taskReqSchema>;
