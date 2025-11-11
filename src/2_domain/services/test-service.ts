import { ITestService } from "../../1_inbound/ports/services/I-test-service";
import { IRepository } from "../ports/I-repository";

export class TestService implements ITestService{
    private _repo
    constructor(repositories: IRepository){
        this._repo = repositories
    }

    getTest(): string {
        return this._repo.testRepository.findTest();
    }
}