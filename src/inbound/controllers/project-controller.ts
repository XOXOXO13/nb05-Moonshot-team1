import { AuthMiddleware } from "../middlewares/auth-middleware";
import { IServices } from "../ports/I-services";
import {
  CreateProjectDto,
  UpdateProjectDto,
} from "../requests/project-req-dto";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

export class ProjectController extends BaseController {
  constructor(
    _services: IServices,
    private _authMiddlewares: AuthMiddleware,
  ) {
    super({ basePath: "/projects", services: _services });
    this.register();
  }

  register() {
    // [프로젝트 관리]
    // 프로제스 생성
    this.router.post(
      "/",
      this.catch(this._authMiddlewares.validateAccessToken),
      this.catch(this._authMiddlewares.checkSignedInUser),
      this.catch(this.createProject)

    );
    // 프로젝트 조회
    this.router.get(
      "/:projectId",
      this.catch(this._authMiddlewares.validateAccessToken),
      this.catch(this._authMiddlewares.checkSignedInUser),
      this.catch(this.getProject)

    );

    // 프로젝트 수정
    this.router.patch(
      "/:projectId",
      this.catch(this._authMiddlewares.validateAccessToken),
      this.catch(this._authMiddlewares.checkSignedInUser),
      this.catch(this.updateProject)

    );

    // 프로젝트 삭제
    this.router.delete(
      "/:projectId",
      this.catch(this._authMiddlewares.validateAccessToken),
      this.catch(this._authMiddlewares.checkSignedInUser),
      this.catch(this.deleteProject)

    );

    // [멤버 관리]
    // 프로젝트 멤버 조회
    this.router.get(
      "/:projectId/users",
      this.catch(this._authMiddlewares.validateAccessToken),
      this.catch(this._authMiddlewares.checkSignedInUser),
      this.catch(this.getProjectMembers)

    );
    // 프로젝트에서 유저 제외하기
    this.router.delete(
      "/:projectId/users/:userId",
      this.catch(this._authMiddlewares.validateAccessToken),
      this.catch(this._authMiddlewares.checkSignedInUser),
      this.catch(this.deleteMember)

    );
    // 프로젝트에 멤버 초대
    this.router.post(
      "/:projectId/invitations",
      this.catch(this._authMiddlewares.validateAccessToken),
      this.catch(this._authMiddlewares.checkSignedInUser),
      this.catch(this.inviteMember)

    );
  }

  getProject = async (req: Request, res: Response) => {
    const projectId: number = Number(req.params.projectId);
    const project = await this.services.project.getProjectById(projectId);
    return res.json(project);
  };

  createProject = async (req: Request, res: Response) => {
    const dto = {
      ...req.body,
      userId: req.user?.userId,
    } as CreateProjectDto;
    const project = await this.services.project.createProject(dto);

    return res.json(project);
  };

  updateProject = async (req: Request, res: Response) => {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "로그인이 필요합니다" });
    }
    const projectId: number = Number(req.params.projectId);
    const dto: UpdateProjectDto = {
      name: req.body.name,
      description: req.body.description,
      userId: req.user.userId,
      projectId: projectId,
    };
    const project = await this.services.project.updateProject(dto);

    return res.json(project);
  };

  deleteProject = async (req: Request, res: Response) => {
    const projectId: number = Number(req.params.projectId);
    const userId: number = Number(req.userId);
    await this.services.project.deleteProject(projectId, userId);
    return res.status(204).json();
  };

  getProjectMembers = async (req: Request, res: Response) => {
    const projectId: number = Number(req.params.projectId);
    const page: number = Number(req.params.page);
    const limit: number = Number(req.params.limit);
    const userId: number = Number(req.userId);

    const members = await this.services.member.getProjectMembers(
      projectId,
      userId,
      page,
      limit

    );
    return res.json(members);
  };

  deleteMember = async (req: Request, res: Response) => {
    const projectId: number = Number(req.params.projectId);
    const deletedUserId: number = Number(req.params.userId);
    const deleterId: number = Number(req.userId);

    await this.services.member.deleteMember(
      projectId,
      deletedUserId,
      deleterId,
    );
    return res.status(204).json();
  };

  inviteMember = async (req: Request, res: Response) => {
    const projectId: number = Number(req.params.projectId);
    const invitorId: number = Number(req.userId);

    const invitation = await this.services.invitation.inviteMember(projectId, invitorId);

    return res.status(201).json(invitation);
  };
}
