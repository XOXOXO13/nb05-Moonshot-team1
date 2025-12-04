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

// 댓글 생성
export const createCommentBodySchema = z.object({
  content: z.string(),
});

export const createCommentParamsSchema = z.object({
  taskId: z.coerce.number(),
});

export type CreateCommentDto = z.infer<typeof createCommentBodySchema> &
  z.infer<typeof createCommentParamsSchema> & {
    userId: number;
  };

// 할 일에 달린 댓글 조회
export const taskCommentQuerySchema = z.object({
  page: z.coerce.number().gt(0).default(1).optional(),
  limit: z.coerce.number().gt(1).default(10).optional(),
});

export const taskCommentParamschema = z.object({
  taskId: z.coerce.number(),
});

export type TaskCommentDto = z.infer<typeof taskCommentQuerySchema> &
  z.infer<typeof taskCommentParamschema> & {
    userId: number;
  };

// 댓글 수정

export const updateCommentBodySchema = z.object({
  content: z.string(),
});

export const updateCommentParamsSchema = z.object({
  commentId: z.coerce.number(),
});

export type updateCommentDto = z.infer<typeof updateCommentBodySchema> &
  z.infer<typeof updateCommentParamsSchema> & {
    userId: number;
  };
