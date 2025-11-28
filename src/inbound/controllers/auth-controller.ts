import { Response } from "express";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { IServices } from "../ports/I-services";
import { BaseController } from "./base-controller";
import { Utils } from "../../shared/utils-interface";
import {
  RefreshTokenInput,
  SignInInput,
  SignUpInput,
  SignUpOrSignInSocialInput,
} from "../ports/services/I-auth-service";

export class AuthController extends BaseController {
  constructor(
    services: IServices,
    private _authMiddleware: AuthMiddleware,
    utils: Utils,
  ) {
    super({
      basePath: "/auth",
      services,
      utils,
    });
    this.registerAuthRoutes();
  }
  private registerAuthRoutes() {
    this.router.post(
      "/register",
      this.catch(this._authMiddleware.checkNotSignedInUser),
      this.catch(this.register),
    );
    this.router.post(
      "/login",
      this.catch(this._authMiddleware.checkNotSignedInUser),
      this.catch(this.login),
    );
    this.router.post("/refresh", this.catch(this.refresh));
    this.router.post(
      "/logout",
      this.catch(this._authMiddleware.validateAccessToken),
      this.catch(this.logout),
    );
    this.router.post(
      "/google",
      this.catch(this._authMiddleware.checkNotSignedInUser),
      this.catch(this.signInGoogle),
    );
    this.router.get(
      "/google/callback",
      this.catch(this._authMiddleware.checkNotSignedInUser),
      this.catch(this.signInGoogleCallback),
    );
  }
  register = async (req: any, res: Response) => {
    try {
      const { email, password, name, profileImage } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({
          error: "Missing required fields: email, password, name",
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long",
        });
      }
      const input: SignUpInput = {
        email,
        password,
        name,
        profileImage,
      };

      const user = await this.services.auth.signUp(input);
      return res.status(201).json(user);
    } catch (error: any) {
      if (
        error.message?.includes("duplicate") ||
        error.message?.includes("Unique") ||
        error.message?.includes("already exists")
      ) {
        return res.status(409).json({
          error: "Email already exists",
        });
      }
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  };
  login = async (req: any, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          error: "Missing required fields: email, password",
        });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }

      const input: SignInInput = {
        email,
        password,
      };

      await this.services.auth.signIn(input);
      const user = await this.services.user.findById(req.user?.id || 0);
      if (!user) {
        const userByEmail = await this.services.user.findByEmail(email);
        if (!userByEmail) {
          return res.status(401).json({
            error: "Invalid email or password",
          });
        }
        const accessToken = this.utils!.token.generateAccessToken({
          userId: userByEmail.id!,
          email: userByEmail.email,
        });
        const refreshToken = this.utils!.token.generateRefreshToken({
          userId: userByEmail.id!,
          email: userByEmail.email,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        return res.status(200).json({
          accessToken,
          refreshToken,
        });
      }

      const accessToken = this.utils!.token.generateAccessToken({
        userId: user.id!,
        email: user.email,
      });
      const refreshToken = this.utils!.token.generateRefreshToken({
        userId: user.id!,
        email: user.email,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      if (
        error.message?.includes("Invalid") ||
        error.message?.includes("not found") ||
        error.message?.includes("unauthorized")
      ) {
        return res.status(401).json({
          error: "Invalid email or password",
        });
      }
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  };
  refresh = async (req: any, res: Response) => {
    try {
      const refreshToken = req.body?.refreshToken || req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          error: "Missing refresh token",
        });
      }
      const input: RefreshTokenInput = {
        refreshToken,
      };

      const {
        accessToken,
        refreshToken: newRefreshToken,
        csrfToken,
      } = await this.services.auth.refreshTokens(input);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        accessToken,
        refreshToken: newRefreshToken,
        csrfToken,
      });
    } catch (error: any) {
      if (
        error.message?.includes("Invalid") ||
        error.message?.includes("expired") ||
        error.message?.includes("invalid")
      ) {
        return res.status(401).json({
          error: "Invalid or expired refresh token",
        });
      }
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  };
  logout = async (req: any, res: Response) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          error: "Unauthorized",
        });
      }

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.status(200).json({
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  };

  signInGoogle = async (req: any, res: Response) => {
    try {
      const googleSignInUrl = new URL(
        "https://accounts.google.com/o/oauth2/v2/auth",
      );

      googleSignInUrl.searchParams.set(
        "client_id",
        process.env.GOOGLE_OAUTH_CLIENT_ID || "",
      );

      googleSignInUrl.searchParams.set("response_type", "code");
      googleSignInUrl.searchParams.set("scope", "email profile openid");

      return res.redirect(
        googleSignInUrl.toString() +
          `&redirect_uri=${process.env.GOOGLE_OAUTH_REDIRECT_URI}`,
      );
    } catch (error: any) {
      return res.status(500).json({
        error: "Failed to initiate Google OAuth",
      });
    }
  };
  signInGoogleCallback = async (req: any, res: Response) => {
    try {
      const { code } = req.query;

      if (!code) {
        return res.status(400).json({
          error: "Missing code ",
        });
      }

      const input: SignUpOrSignInSocialInput = {
        authCode: code as string,
        provider: "google",
      };

      const { accessToken, refreshToken, csrfToken } =
        await this.services.auth.signUpOrSignInSocial(input);

      res.clearCookie("connect.sid");
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.cookie("csrfToken", csrfToken, {
        secure: process.env.NODE_ENV === "production",
      });

      return res.redirect(process.env.GOOGLE_REDIRECT_SUCCESS_URL || "/");
    } catch (error: any) {
      return res.status(500).json({
        error: "Failed to process Google OAuth callback",
      });
    }
  };
}
