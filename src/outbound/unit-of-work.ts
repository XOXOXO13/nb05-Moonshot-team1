import { PrismaClient } from "@prisma/client";
import { IRepositories } from "../domain/ports/repositories-interface";
import { RepositoryFactory } from "./repository-factory";

export class UnitOfWork{
  private _prismaClient: PrismaClient;
  private _repoFactory
  private _repos: IRepositories;

  constructor(prismaClient: PrismaClient, repoFactory: RepositoryFactory) {
    this._prismaClient = prismaClient;
    this._repoFactory = repoFactory;
    this._repos = this._repoFactory.create(this._prismaClient);
  }

  get repos(): IRepositories {
    return this._repos;
  }

  async do<T>(
    work: (repos: IRepositories) => Promise<T>,
    isOptimistic: boolean = true,
    isolationLevel:
      | "ReadCommitted"
      | "RepeatableRead"
      | "Serializable" = "ReadCommitted",
  ): Promise<T> {
    const maxRetries = isOptimistic ? 5 : 1;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this._prismaClient.$transaction(
          async (tx) => {
            const txRepos: IRepositories = this._repoFactory.create(tx);
            return await work(txRepos);
          },
          {
            isolationLevel,
          },
        );
      } catch (err) {
        // Exception 구현 필요
        // if (
        //   err instanceof TechnicalException &&
        //   err.type === TechnicalExceptionType.OPTIMISTIC_LOCK_FAILED
        // ) {
        //   if (i < maxRetries - 1) {
        //     console.warn(`${i + 1}th 재시도(최대 ${maxRetries}회)`);
        //     await new Promise((resolve) => setTimeout(resolve, 100 * (i + 1)));
        //     continue;
        //   }
        // }
        throw err;
      }
    }

    throw new Error("최대 시도 횟수를 초과했습니다.");
  }
}