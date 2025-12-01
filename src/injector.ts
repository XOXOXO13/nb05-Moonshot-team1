import { PrismaClient } from "@prisma/client";
import { AuthController } from "./inbound/controllers/auth-controller";
import { UsersController } from "./inbound/controllers/user-controller";
import { AuthMiddleware } from "./inbound/middlewares/auth-middleware";
import { UserService } from "./domain/services/user-service";
import { BcryptHashManager } from "./outbound/managers/bcrypt-hash-manager";
import { UserRepository } from "./outbound/repos/user-repository";
import { Services } from "./domain/services";
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
import { InvitationRepository } from "./outbound/repos/invitation-repository";
import { MemberRepository } from "./outbound/repos/member-repository";
import { InvitationService } from "./domain/services/invitation-service";
import { EmailService } from "./domain/services/email-service";
import { MemberService } from "./domain/services/member-service";
import { InvitationrController } from "./inbound/controllers/invitation-controller";
import { smtpConfig } from "./shared/utils/smtp-util";
import { TagRepository } from "./outbound/repos/tag-repository";
import { FileController } from "./inbound/controllers/file-controller";
// 추가
import { CommentRepository } from "./outbound/repos/comment-repository";
import { CommentService } from "./domain/services/comment-service";
import { CommentController } from "./inbound/controllers/comment-controller";
import { SubTaskRepository } from "./outbound/repos/subtask-repository";
import { SubTaskService } from "./domain/services/subtask-service";
import { SubTaskController } from "./inbound/controllers/subtask-controller";

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
    const smtp = smtpConfig;
    // 추가
    const commentRepository = new CommentRepository(prisma);
    const commentService = new CommentService(commentRepository);
    const commentController = new CommentController(commentService);

    const hashManager = new BcryptHashManager();

    const repoFactory = new RepositoryFactory({
      projectRepository: (prismaClient) => new ProjectRepository(prismaClient),
      taskRepository: (prismaClient) => new TaskRepository(prismaClient),
      subTaskRepository: (prismaClient) => new SubTaskRepository(prismaClient),
      tagRepository: (prismaClient) => new TagRepository(prismaClient),
      userRepository: (prismaClient) => new UserRepository(prismaClient),
      invitationRepository: (prismaClient) =>
        new InvitationRepository(prismaClient),
      memberRepository: (prismaClient) => new MemberRepository(prismaClient),
    });

    const unitOfWork: UnitOfWork = new UnitOfWork(prisma, repoFactory);
    const repositories = unitOfWork.repos;

    const emailService = new EmailService(smtp, "no-reply@moonshot.com");
    const taskService = new TaskService(unitOfWork);
    const subTaskService = new SubTaskService(unitOfWork);
    const projectService = new ProjectService(unitOfWork);
    const userService = new UserService(unitOfWork.userRepository, hashManager);
    const authService = new AuthService(unitOfWork.userRepository, hashManager);
    const invitationService = new InvitationService(unitOfWork, emailService);
    const memberService = new MemberService(unitOfWork);
    const services = new Services(
      taskService,
      subTaskService,
      projectService,
      userService,
      authService,
      invitationService,
      memberService,
    );

    const authMiddleware = new AuthMiddleware(utils);
    const middlewares = [authMiddleware];

    const fileController = new FileController(services);
    const taskController = new TaskController(services, authMiddleware);
    const subTaskController = new SubTaskController(services, authMiddleware);
    const projectController = new ProjectController(services, authMiddleware);
    const authController = new AuthController(services, authMiddleware, utils);
    const usersController = new UsersController(services, authMiddleware);
    const invitationController = new InvitationrController(
      services,
      authMiddleware,
    );
    const controllers: any = [
      fileController,
      taskController,
      subTaskController,
      projectController,
      authController,
      usersController,
      invitationController,
      // 추가
      commentController,
    ];

    const port = parseInt(process.env.PORT || "4000", 10);
    return new Server(controllers, port);
  }
}
