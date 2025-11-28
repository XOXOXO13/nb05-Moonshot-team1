import jwt, {
  TokenExpiredError,
  JsonWebTokenError,
  SignOptions,
} from "jsonwebtoken";
import { IConfigUtil } from "./config-util";

export type TokenPayload = {
  userId: number;
  email: string;
  exp: number;
  iax: number;
};

export type TokenGenerateParams = {
  userId: number;
  email: string;
  expiresIn?: string | number;
};

export interface ITokenUtil {
  generateToken(params: TokenGenerateParams): string;
  generateAccessToken(params: Omit<TokenGenerateParams, "expiresIn">): string;
  generateRefreshToken(params: Omit<TokenGenerateParams, "expiresIn">): string;
  verifyToken(params: {
    token: string;
    ignoreExpiration?: boolean;
  }): TokenPayload;
}

export class TokenUtil implements ITokenUtil {
  constructor(private _config: IConfigUtil) {}

  generateAccessToken(params: Omit<TokenGenerateParams, "expiresIn">): string {
    const expiresIn = this._config.parsed().ACCESS_TOKEN_EXPIRES_IN ?? "15m";
    return this.generateToken({ ...params, expiresIn});
  }
  generateRefreshToken(params: Omit<TokenGenerateParams, "expiresIn">): string {
    return this.generateToken({ ...params, expiresIn: "7d" });
  }

  generateToken(params: TokenGenerateParams): string {
    const { userId, email, expiresIn = "10h" } = params;

    const secret = this._config.parsed().TOKEN_SECRET;
    if (!secret || secret.length < 10) {
      throw new Error("유효하지 않은 토큰 시크릿입니다.");
    }

    const payload = {
      userId,
      email,
    };

    const options: SignOptions = {
      expiresIn: expiresIn,
      algorithm: "HS256",
      issuer: "moonshot-auth-service",
    } as SignOptions;

    try {
      return jwt.sign(payload, secret, options);
    } catch (error) {
      throw new Error(
        `토큰 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
  verifyToken(params: {
    token: string;
    ignoreExpiration?: boolean;
  }): TokenPayload {
    const { token, ignoreExpiration = false } = params;
    const secret = this._config.parsed().TOKEN_SECRET;
    if (!secret || secret.length < 10) {
      throw new Error("유효하지 않은 토큰 시크릿입니다.");
    }

    try {
      const decoded = jwt.verify(token, secret, {
        ignoreExpiration,
        algorithms: ["HS256"],
        issuer: "moonshot-auth-service",
      }) as TokenPayload;
      if (!decoded.userId || !decoded.email) {
        throw new JsonWebTokenError("토큰에 필수 정보가 없습니다.");
      }

      return decoded;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new Error("토큰이 만료되었습니다.");
      }

      if (error instanceof JsonWebTokenError) {
        throw new Error("유효하지 않은 토큰입니다.");
      }

      throw new Error(
        `토큰 검증 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
