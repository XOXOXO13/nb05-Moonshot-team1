import { IRepositories } from "./repositories/I-repositories";

export interface ConcurrencyPolicy {
  maxRetries: number;
  isolationLevel: "ReadCommitted" | "RepeatableRead" | "Serializable";
}

export interface IUnitOfWork {
  readonly repos: IRepositories;
  do<T>(
    work: (repos: IRepositories) => Promise<T>,
    isOptimistic?: boolean,
    isolationLevel?: "ReadCommitted" | "RepeatableRead" | "Serializable",
  ): Promise<T>;

  doWithPolicy?<T>(
    work: (repos: IRepositories) => Promise<T>,
    policy: ConcurrencyPolicy,
  ): Promise<T>;
}
