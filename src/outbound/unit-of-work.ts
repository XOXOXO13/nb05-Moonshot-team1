import { PrismaClient } from "@prisma/client";
import { IRepositories } from "../domain/ports/repositories-interface";
import { UserRepository } from "./repos/user-repository";
import { IUserRepository } from "../domain/ports/repositories/I-user-repository";
import { RepositoryFactory } from "./repository-factory";

export class UnitOfWork {
  private _prismaClient: PrismaClient;
  private _repoFactory: RepositoryFactory;
  private _repos: IRepositories;
  private _userRepository?: UserRepository;

  constructor(prismaClient: PrismaClient, repoFactory: RepositoryFactory) {
    this._prismaClient = prismaClient;
    this._repoFactory = repoFactory;
    this._repos = this._repoFactory.create(this._prismaClient);
  }

  get repos(): IRepositories {
    return this._repos;
  }
  get userRepository(): IUserRepository {
    if (!this._userRepository) {
      this._userRepository = new UserRepository(this._prismaClient);
    }
    return this._userRepository;
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
          async (tx: PrismaClient) => {
            const txRepos: IRepositories = this._repoFactory.create(tx);
            return await work(txRepos);
          },
          {
            isolationLevel,
          },
        );
      } catch (err) {
        if (this.isRetryableError(err) && isOptimistic && i < maxRetries - 1) {
          console.warn(
            `트랜잭션 재시도 ${i + 1}/${maxRetries} - ${err instanceof Error ? err.message : "Unknown error"}`,
          );
          await this.delay(Math.pow(2, i) * 100);
          continue;
        }
        throw err;
      }
    }

    throw new Error("최대 시도 횟수를 초과했습니다.");
  }

  private isRetryableError(err: unknown): boolean {
    if (!(err instanceof Error)) {
      return false;
    }

    const retryableErrorCodes = [
      "P2034", // 트랜잭션 충돌
      "P2002", // 유니크 제약 조건 위반
      "P1008", // 작업 타임아웃
    ];

    return (
      retryableErrorCodes.some((code) => err.message.includes(code)) ||
      err.message.includes("Transaction deadlock") ||
      err.message.includes("could not serialize access") ||
      err.message.includes("restart transaction")
    );
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
