import { Router, Request, Response } from "express";
import { IUserService } from "../../domain/services/user-service";
import { AuthMiddleware } from "../middlewares/auth-middlewares";
import { SocialProvider } from "../../domain/entities/social-account/social-account-entity";

export class UserController {
  public basePath = "";
  public router = Router();

  constructor(private userService: IUserService) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post("/auth/register", this.register.bind(this));
    this.router.post("/auth/login", this.login.bind(this));
    this.router.post("/auth/refresh", this.refresh.bind(this));
    this.router.get("/auth/google", this.googleAuth.bind(this));
    this.router.get("/auth/google/callback", this.googleCallback.bind(this));

    // === 사용자 정보 관리 (나중에 구현할 예정) ===
    // this.router.get('/users/me', AuthMiddleware.authenticate, this.getMe.bind(this));
    // this.router.patch('/users/me', AuthMiddleware.authenticate, this.updateMe.bind(this));
    // this.router.get('/users/me/projects', AuthMiddleware.authenticate, this.getUserProjects.bind(this));
    // this.router.get('/users/me/tasks', AuthMiddleware.authenticate, this.getUserTasks.bind(this));
  }
  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const cookieOptions = {
      httpOnly: false,
      secure: false,
      sameSite: "none" as const,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    };

    res.cookie("authToken", accessToken, cookieOptions);
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);
  }

  private generateTokenResponse(user: any, res: Response) {
    const accessToken = AuthMiddleware.generateToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = AuthMiddleware.generateToken({
      userId: user.id!,
      email: user.email,
    });
    this.setTokenCookies(res, accessToken, refreshToken);

    return { accessToken, refreshToken };
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          error: "REFRESH_TOKEN_REQUIRED",
          message: "Refresh token이 필요합니다.",
        });
      }

      const decoded = AuthMiddleware.verifyToken(refreshToken);

      const user = await this.userService.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          error: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      const tokens = this.generateTokenResponse(user, res);

      res.status(200).json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error: any) {
      console.error("Refresh error:", error);
      res.status(401).json({
        error: "INVALID_REFRESH_TOKEN",
        message: "Refresh token이 유효하지 않습니다.",
      });
    }
  }
  //임시구현 google
  async googleAuth(req: Request, res: Response) {
    res.status(501).json({
      error: "NOT_IMPLEMENTED",
      message: "Google OAuth가 아직 구현되지 않았습니다.",
    });
  }
  async googleCallback(req: Request, res: Response) {
    res.status(501).json({
      error: "NOT_IMPLEMENTED",
      message: "Google OAuth 콜백이 아직 구현되지 않았습니다.",
    });
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, profileImageUrl } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          error: "EMAIL_PASSWORD_NAME_REQUIRED",
          message: "이메일, 비밀번호, 이름은 필수입니다.",
        });
      }

      const user = await this.userService.registerLocal({
        email,
        password,
        name,
        profileImageUrl,
      });

      this.generateTokenResponse(user, res);
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImageUrl || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error: any) {
      console.error("Register error:", error);

      if (error.message.includes("이미 사용 중인 이메일")) {
        return res.status(409).json({
          error: "EMAIL_ALREADY_EXISTS",
          message: error.message,
        });
      }

      if (
        error.message.includes("비밀번호는") ||
        error.message.includes("이름은") ||
        error.message.includes("올바른 이메일")
      ) {
        return res.status(400).json({
          error: "VALIDATION_ERROR",
          message: error.message,
        });
      }

      res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "서버 내부 오류가 발생했습니다.",
      });
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: "EMAIL_PASSWORD_REQUIRED",
          message: "이메일과 비밀번호는 필수입니다.",
        });
      }
      const user = await this.userService.loginLocal(email, password);
      const tokens = this.generateTokenResponse(user, res);

      res.status(200).json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error: any) {
      console.error("Login Error", error);

      if (
        error.message.includes("사용자를 찾을 수 없습니다.") ||
        error.message.includes("비밀번호가 일치하지 않습니다.")
      ) {
        return res.status(401).json({
          error: "Invalid_credentials",
          message: "이메일 또는 비밀번호가 올바르지 않습니다.",
        });
      }
      res.status(500).json({
        error: "Internam_server_error",
        message: "서버 내부 오류가 발생했습니다.",
      });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const user = await this.userService.findById(userId);

      if (!user) {
        return res.status(404).json({
          error: "USER_NOT_FOUND",
          message: "사용자를 찾을 수 없습니다.",
        });
      }

      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImageUrl: user.profileImageUrl,
          socialAccounts: user.socialAccounts.map((account) => ({
            provider: account.provider,
            createdAt: account.createdAt,
          })),
        },
      });
    } catch (error: any) {
      console.error("GetMe error:", error);
      res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "서버 내부 오류가 발생했습니다.",
      });
    }
  }

  // 사용자 정보 수정
  async updateMe(req: Request, res: Response) {
    try {
      const userId = req.user!.userId;
      const { name, profileImageUrl } = req.body;

      const user = await this.userService.updateProfile(userId, {
        name,
        profileImageUrl,
      });

      res.status(200).json({
        message: "사용자 정보가 업데이트되었습니다.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          profileImageUrl: user.profileImageUrl,
        },
      });
    } catch (error: any) {
      console.error("UpdateMe error:", error);

      if (error.message.includes("사용자를 찾을 수 없습니다")) {
        return res.status(404).json({
          error: "USER_NOT_FOUND",
          message: error.message,
        });
      }

      res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "서버 내부 오류가 발생했습니다.",
      });
    }
  }
}
