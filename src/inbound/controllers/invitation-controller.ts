import { AuthMiddleware } from "../middlewares/auth-middleware";
import { IServices } from "../ports/I-services";
import { BaseController } from "./base-controller";
import { Request, Response } from "express";

export class InvitationrController extends BaseController {
  constructor(
    _services: IServices,
    private _authMiddlewares: AuthMiddleware,
  ) {
    super({ basePath: "/invitations", services: _services });
    this.register();
  }

  register() {
    // 멤버 초대 수락
    this.router.post(
      "/:invitationId/accept",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.acceptInvitation),
    );
    // 멤버 초대 삭제
    this.router.delete(
      "/:invitationId",
      this.catch(this._authMiddlewares.isUser),
      this.catch(this.deleteInvitation),
    );
  }

  acceptInvitation = async (req: Request, res: Response) => {
    const userId: number = Number(req.userId);
    const token: string = req.params.invitationId;

    const newMember = await this.services.invitation.acceptInvitation(
      token,
      userId,
    );
    return res.status(200).json();
  };

  deleteInvitation = async (req: Request, res: Response) => {
    const creatorId: number = Number(req.userId);
    const token: string = req.params.invitationId;
    await this.services.invitation.deleteInvitation(token, creatorId);
    return res.status(204).json();
  };
}
