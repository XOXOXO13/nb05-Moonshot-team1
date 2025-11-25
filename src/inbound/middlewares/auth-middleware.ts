import { Request, Response, NextFunction } from "express";
import { IUtils } from "../../shared/utils-interface";
import { TokenGenerateParams } from "../../shared/utils/token-util";
import jwt from "jsonwebtoken";
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
    user?: {
      userId: number;
      email: string;
    };
  }
}

export class AuthMiddleware {
  constructor(private _utils: IUtils) { }

  static generateToken = (
    params: TokenGenerateParams,
    utils: IUtils,
  ): string => {
    return utils.token.generateToken(params);
  };

  static verifyToken = (token: string, utils: IUtils) => {
    return utils.token.verifyToken({ token });
  };

  isUser = (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (!authHeader || typeof authHeader !== "string") {
        return res.status(401).json({
          error: "UNAUTHORIZED",
          message: "인증 토큰이 필요합니다.",
        });
      }

      const tokenParts = authHeader.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).json({
          error: "INVALID_TOKEN_FORMAT",
          message:
            "토큰 형식이 올바르지 않습니다. 'Bearer {token}' 형식을 사용하세요.",
        });
      }
      
      const accessToken = tokenParts[1];
      const payload = this._utils.token.verifyToken({ token: accessToken });
      req.userId = payload.userId.toString();
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };

      return next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "TOKEN_EXPIRED",
          message: "토큰이 만료되었습니다.",
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          error: "INVALID_TOKEN",
          message: "유효하지 않은 토큰입니다.",
        });
      }

      return res.status(500).json({
        error: "INTERNAL_SERVER_ERROR",
        message: "토큰 검증 중 오류가 발생했습니다.",
      });
    }
  };
}
