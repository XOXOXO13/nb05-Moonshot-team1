import { PrismaClient } from "@prisma/client";
import { TestRepository } from "./outbound/repositories/test-repository";
import { Server } from "./server";
import { TestService } from "./domain/services/test-service";
import { TestController } from "./inbound/controllers/test-controller";
export class DependencyInjector {
  private _server: Server;

  constructor() {
    this._server = this.inject();
  }

  inject() {
    const prisma = new PrismaClient();

    const testRepository = new TestRepository(prisma);
    const repositories = {
      testRepository: testRepository,
    };

    const testService = new TestService(repositories);
    const services = {
      testService: testService,
    };

    const testController = new TestController(services);
    const controllers = [testController];

    return new Server(controllers);
  }

  get server() {
    return this._server;
  }
}
