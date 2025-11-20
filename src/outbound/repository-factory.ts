import { IRepositories } from "../domain/ports/repositories-interface";
import { BasePrismaClient } from "./repos/base-repository";

type repositoryGenerator = (
  client: BasePrismaClient,
) => IRepositories[keyof IRepositories];

export class RepositoryFactory {
  private _repositoryGenerators: Record<
    keyof IRepositories,
    repositoryGenerator
  >;

  constructor(factories: Record<keyof IRepositories, repositoryGenerator>) {
    this._repositoryGenerators = factories;
  }

  public create(prismaClient: BasePrismaClient): IRepositories {
    const repos = {} as IRepositories;
    const repoKeys = Object.keys(
      this._repositoryGenerators,
    ) as (keyof IRepositories)[];

    for (const key of repoKeys) {
      // repos[key] = this._repositoryGenerators[key](prismaClient);
    }

    return repos;
  }
}
