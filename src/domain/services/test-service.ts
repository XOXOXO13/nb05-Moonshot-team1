import { ITestService } from "../../inbound/ports/services/I-test-service";
import { IRepositories } from "../ports/repositories-interface";

export class TestService implements ITestService {
  private _repo;
  constructor(repositories: IRepositories) {
    this._repo = repositories;
  }

  getTest(): string {
    return "test";
  }
}
