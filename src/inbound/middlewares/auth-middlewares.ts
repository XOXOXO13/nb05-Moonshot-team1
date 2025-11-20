import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
    }
  }
}
export interface JWTPayload {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export class AuthMiddleware {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "secret-jwt-key";

  static generateToken(payload: { userId: number; email: string }): string {
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: "7d",
    });
  }
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  static authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      let token: string | undefined;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
      if (!token && req.cookies) {
        const cookieTokens = [
          req.cookies.accessToken,
          req.cookies.authToken,
          req.cookies.token,
          req.cookies.access_token,
          req.cookies.jwt,
          req.cookies.auth,
        ].filter(Boolean);

        if (cookieTokens.length > 0) {
          token = cookieTokens[0];
        }
      }
      if (!token) {
        const headerSources = [
          req.headers["x-auth-token"],
          req.headers["x-access-token"],
          req.headers["x-token"],
          req.headers["auth-token"],
          req.headers["access-token"],
          req.headers["jwt"],
          req.headers["token"],
        ];

        for (const headerToken of headerSources) {
          if (headerToken && typeof headerToken === "string") {
            token = headerToken;
            break;
          }
        }
      }
      if (!token && req.query.token && typeof req.query.token === "string") {
        token = req.query.token;
      }

      if (!token) {
        res.status(401).json({
          error: "AUTHENTICATION_REQUIRED",
          message: "로그인이 필요합니다.",
        });
        return;
      }
      const decoded = AuthMiddleware.verifyToken(token);
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };

      next();
    } catch (error: any) {
      console.error("Authentication error:", error);

      if (error.message.includes("Invalid or expired token")) {
        res.status(401).json({
          error: "INVALID_TOKEN",
          message: "토큰이 유효하지 않거나 만료되었습니다.",
        });
        return;
      }

      res.status(500).json({
        error: "AUTHENTICATION_ERROR",
        message: "인증 처리 중 오류가 발생했습니다.",
      });
    }
  }
  static optionalAuth(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        next();
        return;
      }
      const token = authHeader.substring(7);

      if (token) {
        try {
          const decoded = AuthMiddleware.verifyToken(token);
          req.user = {
            userId: decoded.userId,
            email: decoded.email,
          };
        } catch (error) {}
      }
      next();
    } catch (error) {
      next();
    }
  }
}
