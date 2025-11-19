import { PrismaClient } from "@prisma/client";
import { Server } from "./server";
import { TaskController } from "./inbound/controllers/task-controller";
import { TaskService } from "./domain/services/task-service";
import { TaskRepository } from "./outbound/repos/task-repository";

export class DependencyInjector {
  private _server: Server;

  constructor() {
    this._server = this.inject();
  }

  inject() {
    const prisma = new PrismaClient();

    const taskRepository = new TaskRepository(prisma);

    const repositories = {
      taskRepository: taskRepository,
    };

    const taskService = new TaskService(repositories);

    const services = {
      taskService: taskService,
    };

    const taskController = new TaskController(services);

    const controllers = [taskController];

    return new Server(controllers);
  }

  get server() {
    return this._server;
  }
}
