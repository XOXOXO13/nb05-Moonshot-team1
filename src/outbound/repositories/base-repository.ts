import { PrismaClient } from "@prisma/client";

// PrismaClient 의 연결 관리 기능 제외
export type PrismaClientTransaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

// 일반 DB 클라이언트와 트랜잭션 DB 클라이언트 모두 허용
export type BasePrismaClient = PrismaClient | PrismaClientTransaction;

export class BaseRepository {
  protected _prismaClient;

  constructor(prismaClient: BasePrismaClient) {
    this._prismaClient = prismaClient;
  }
}