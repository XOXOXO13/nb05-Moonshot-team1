import { IServices } from "../ports/services-interface";
import { BaseController } from "./base-controller";

export class ProjectMemeberController extends BaseController {
  constructor(_services: IServices) {
    super({ basePath: "/invitations", services: _services });
  }

  register() {
    // 멤버 초대 수락
    this.router.post("/:invitationId/accept");
    // 멤버 초대 삭제
    this.router.delete("/:invitationId");
  }
}
