import { PrismaClient } from "@prisma/client";
import { AuthController } from "./inbound/controllers/auth-controller";
import { UsersController } from "./inbound/controllers/user-controller";
import { AuthMiddleware } from "./inbound/middlewares/auth-middleware";
import { UserService } from "./domain/services/user-service";
import { BcryptHashManager } from "./outbound/managers/bcrypt-hash-manager";
import { UserRepository } from "./outbound/repos/user-repository";
import { Services } from "./domain/sevices";
import { Server } from "./server";
import { TaskController } from "./inbound/controllers/task-controller";
import { TaskService } from "./domain/services/task-service";
import { TaskRepository } from "./outbound/repos/task-repository";
import { ProjectRepository } from "./outbound/repos/project-repository";
import { ProjectService } from "./domain/services/project-service";
import { ConfigUtil } from "./shared/utils/config-util";
import { TokenUtil } from "./shared/utils/token-util";
import { Utils } from "./shared/utils-interface";
import { RepositoryFactory } from "./outbound/repository-factory";
import { UnitOfWork } from "./outbound/unit-of-work";
import { ProjectController } from "./inbound/controllers/project-controller";
import { AuthService } from "./domain/services/auth-service";

export class DependencyInjector {
  private _server: Server;

  constructor() {
    this._server = this.inject();
  }

  get server() {
    return this._server;
  }

  inject() {
    const configUtil = new ConfigUtil();
    const tokenUtil = new TokenUtil(configUtil);
    const utils = new Utils(configUtil, tokenUtil);
    const prisma = new PrismaClient();

    const hashManager = new BcryptHashManager();

    const repoFactory = new RepositoryFactory({
      projectRepository: (prismaClient) => new ProjectRepository(prismaClient),
      taskRepository: (prismaClient) => new TaskRepository(prismaClient),
      userRepository: (prismaClient) => new UserRepository(prismaClient),
    });

    const unitOfWork: UnitOfWork = new UnitOfWork(prisma, repoFactory);
    const repositories = unitOfWork.repos;

    const taskService = new TaskService(repositories);
    const projectService = new ProjectService(unitOfWork);
    const userService = new UserService(unitOfWork.userRepository, hashManager);
    const authService = new AuthService(unitOfWork.userRepository, hashManager);
    const services = new Services(
      taskService,
      projectService,
      userService,
      authService,
    );

    const authMiddleware = new AuthMiddleware(utils);
    const middlewares = [authMiddleware];

    const taskController = new TaskController(services);
    const projectController = new ProjectController(services, authMiddleware);
    const authController = new AuthController(services, authMiddleware, utils);
    const usersController = new UsersController(services, authMiddleware);
    const controllers = [
      taskController,
      projectController,
      authController,
      usersController,
    ];

    const port = parseInt(process.env.PORT || "4000", 10);
    return new Server(controllers, port);
  }
}
