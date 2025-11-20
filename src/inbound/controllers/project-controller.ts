import { AuthMiddleware } from "../middlewares/auth-middleware";
import { IServices } from "../ports/services-interface";
import { UpdateProjectDto } from "../requests/project-req-dto";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

export class ProjectController extends BaseController {
  constructor(
    _services: IServices,
    private _authMiddlewares: AuthMiddleware
  ) {
    super({ basePath: "/projects", services: _services });
    this.register();
  }

  register() {
    // 프로제스 생성
    this.router.post(
      "/",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.createProject));
    // 프로젝트 조회
    this.router.get(
      "/:projectId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.getProject));
    // 프로젝트 수정
    this.router.patch(
      "/:projectId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.updateProject));
    // 프로젝트 삭제
    this.router.delete(
      "/:projectId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.deleteProject),
    );

    // 프로젝트 멤버 조회
    this.router.get("/:projectId/users");
    // 프로젝트에서 유저 제외하기
    this.router.delete("/:projectId/users/:userId");
    // 프로젝트에 멤버 초대
    this.router.post("/:projectId/invitations");
  }

  getProject = async (req: Request, res: Response) => {
    const projectId: number = Number(req.params.projectId);
    const project = await this.services.project.getProjectById(projectId);
    return res.json(project);
  };

  createProject = async (req: Request, res: Response) => {
    const project = await this.services.project.createProject(req.body);
    return res.json(project);
  };

  updateProject = async (req: Request, res: Response) => {
    const projectId: number = Number(req.params.projectId);
    const dto: UpdateProjectDto = {
      name: req.body.name,
      description: req.body.description,
      userId: req.body.userId,
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
}
