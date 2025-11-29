import { Request, Response, NextFunction } from "express";
import { IUtils } from "../../shared/utils-interface";
import { TokenGenerateParams } from "../../shared/utils/token-util";
import jwt from "jsonwebtoken";
import {
  BusinessException,
  BusinessExceptionType,
} from "../../shared/exceptions/business-exception";
import { threadCpuUsage } from "process";

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
  constructor(private _utils: IUtils) {}

  static generateToken = (
    params: TokenGenerateParams,
    utils: IUtils,
  ): string => {
    return utils.token.generateToken(params);
  };

  static verifyToken = (token: string, utils: IUtils) => {
    return utils.token.verifyToken({ token });
  };
  protectCrsfAttack = (req: Request, res: Response, next: NextFunction) => {
    if (!["HEAD", "OPTIONS", "GET"].includes(req.method)) {
      const crsfTokenHeader = req.headers["x-crsf-token"];
      const crsfTokenCookie = req.signedCookies.csrfToken;
      if (
        !crsfTokenHeader ||
        !crsfTokenCookie ||
        crsfTokenHeader !== crsfTokenCookie
      ) {
        throw new BusinessException({
          type: BusinessExceptionType.INVALID_AUTH,
        });
      }
    }
    return next();
  };

  validateAccessToken = (
    req: Request,
    res: Response,
    next: NextFunction | (() => void),
  ) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (
      !authHeader ||
      typeof authHeader !== "string" ||
      authHeader.split(" ").length !== 2 ||
      authHeader.split(" ")[0] !== "Bearer"
    ) {
      return next();
    }

    const accessToken = authHeader.split(" ")[1];
    try {
      const payload = this._utils.token.verifyToken({ token: accessToken }) as {
        userId: number;
        email: string;
      };
      req.userId = payload.userId.toString();
      req.user = {
        userId: payload.userId,
        email: payload.email,
      };
    } catch (error) {
      next(error);
    }

    return next();
  };

  checkSignedInUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new BusinessException({
        type: BusinessExceptionType.INVALID_AUTH,
      });
    }
    return next();
  };
  checkNotSignedInUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.userId) {
      throw new BusinessException({
        type: BusinessExceptionType.ALREADY_AUTHENTICATED,
      });
    }
    return next();
  };

  isUser = (req: Request, res: Response, next: NextFunction) => {
    this.validateAccessToken(req, res, () => {
      this.checkSignedInUser(req, res, next);
    });
  };
}
