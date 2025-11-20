import { IServices } from "../ports/services-interface";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

export class ProjectController extends BaseController {
  constructor(_services: IServices) {
    super({ basePath: "/projects", services: _services });
    this.register();
  }

  register(){
    // 프로젝트 조회
    this.router.get("/:projectId");
    // 프로제스 생성
    this.router.post("/");
    // 프로젝트 수정
    this.router.patch("/:projectId");
    // 프로젝트 삭제
    this.router.delete("/:projectId");

    // 프로젝트 멤버 조회
    this.router.get("/:projectId/users");
    // 프로젝트에서 유저 제외하기
    this.router.delete("/:projectId/users/:userId");
    // 프로젝트에 멤버 초대
    this.router.post("/:projectId/invitations");
  }
  getProject = async(req:Request, res: Response) => {
    const userId = req.
  }
}
