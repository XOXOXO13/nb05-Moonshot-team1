import { PrismaClient } from "@prisma/client";

export type PrismaClientTransaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$extends"
>;

export type BasePrismaClient = PrismaClient | PrismaClientTransaction;

export class BaseRepository {
  protected _prismaClient;

  constructor(prismaClient: BasePrismaClient) {
    this._prismaClient = prismaClient;
  }
}
