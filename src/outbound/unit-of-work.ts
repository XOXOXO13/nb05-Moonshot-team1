import { PrismaClient } from "@prisma/client";
import { IRepositories } from "../domain/ports/repositories/I-repositories";
import { UserRepository } from "./repos/user-repository";
import { IUserRepository } from "../domain/ports/repositories/I-user-repository";
import { RepositoryFactory } from "./repository-factory";
import {
  TechnicalException,
  TechnicalExceptionType,
} from "../shared/exceptions/technical.exception";

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
    const maxRetries = isOptimistic ? 7 : 1; // 최대 낙관적 락을 7번으로 설정
    let lastErr;

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
        if (
          err instanceof TechnicalException &&
          err.type === TechnicalExceptionType.OPTIMISTIC_LOCK_FAILED &&
          isOptimistic &&
          i < maxRetries
        ) {
          console.warn(
            `트랜잭션 재시도 ${i + 1}/${maxRetries} - ${err instanceof Error ? err.message : "Unknown error"}`,
          );
          await this.delay(Math.pow(2, i) * 100);
          continue;
        }
        lastErr = err;
      }
    }

    throw lastErr;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
