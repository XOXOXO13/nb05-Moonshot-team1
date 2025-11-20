import {z} from "zod"

export const createProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional()
});

export const updateProjectSchema = z.object({
  name:z.string(),
  description: z.string()
}).refine(data => data.name !== undefined || data.description !== undefined, {
  message: '수정할 내용(이름 또는 설명)이 최소한 하나는 포함되어야 합니다.',
});

export type CreateProjectRequest = z.infer<typeof createProjectSchema>;
export type UpdateProjectRequest = z.infer<typeof updateProjectSchema>;