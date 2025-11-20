import { PrismaClient } from "@prisma/client";
import { UserRepository } from "./outbound/repos/user-repository";
import { BcryptHashManager } from "./outbound/managers/bcrypt-hash-manager";
import { Server } from "./server";
import { TaskController } from "./inbound/controllers/task-controller";
import { TaskService } from "./domain/services/task-service";
import { TaskRepository } from "./outbound/repos/task-repository";
import { ProjectRepository } from "./outbound/repos/project-repository";
import { ProjectService } from "./domain/services/project-service";
import { UserService } from "./domain/services/user-service";
import { UserController } from "./inbound/controllers/user-controller";
import { ConfigUtil } from "./shared/utils/config-util";
import { TokenUtil } from "./shared/utils/token-util";
import { Utils } from "./shared/utils-interface";
import { RepositoryFactory } from "./outbound/repository-factory";
import { UnitOfWork } from "./outbound/unit-of-work";
import { Services } from "./domain/sevices";
import { AuthMiddleware } from "./inbound/middlewares/auth-middleware";
import { ProjectController } from "./inbound/controllers/project-controller";

export class DependencyInjector {
  private _server: Server;

  constructor() {
    this._server = this.inject();
  }

  inject() {
    const configUtil = new ConfigUtil();
    const tokenUtil = new TokenUtil(configUtil);
    const utils = new Utils(configUtil, tokenUtil);
    const prisma = new PrismaClient();

    const repoFactory = new RepositoryFactory({
      projectRepository: (_prisma) => new ProjectRepository(prisma),
      taskRepository: (_prisma) => new TaskRepository(prisma),
      userRepository: (_prisma) => new UserRepository(_prisma),
    });
    const unitOfWork: UnitOfWork = new UnitOfWork(prisma, repoFactory);

    const taskRepository = new TaskRepository(prisma);
    const projectRepository = new ProjectRepository(prisma);
    const userRepository = new UserRepository(prisma);
    const repositories = {
      taskRepository: taskRepository,
      projectRepository: projectRepository,
      userRepository: userRepository,
    };
    const hashManager = new BcryptHashManager();

    const taskService = new TaskService(repositories);
    const projectService = new ProjectService(unitOfWork);
    const userService = new UserService(userRepository, hashManager);
    const services = new Services(taskService, projectService);

    const authMiddleware = new AuthMiddleware(utils);
    const middlewares = [authMiddleware];

    const taskController = new TaskController(services);
    const projectController = new ProjectController(services, authMiddleware);
    const userController = new UserController(userService);
    const controllers = [taskController, projectController, userController];

    const port = parseInt(process.env.PORT || "3001", 10);
    return new Server(controllers, port);
  }

  get server() {
    return this._server;
  }
}
