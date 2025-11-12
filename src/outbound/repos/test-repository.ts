import { PrismaClient } from "@prisma/client";
import { ITestRepository } from "../../domain/ports/repositories/I-test-repository";

export class TestRepository implements ITestRepository {
  private _prisma;

  constructor(prisma: PrismaClient) {
    this._prisma = prisma;
  }

  findTest(): string {
    return "테스트 성공!";
  }
}
