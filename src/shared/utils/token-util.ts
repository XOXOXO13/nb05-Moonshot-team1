import jwt, { TokenExpiredError } from "jsonwebtoken";
import { IConfigUtil } from "./config-util";

export type TokenPayload = {
  userId: string;
  exp: number;
};

export interface ITokenUtil {
  verifyToken(params: {
    token: string;
    ignoreExpiration?: boolean;
  }): TokenPayload;
}

export class TokenUtil implements ITokenUtil {
  constructor(private _config: IConfigUtil) {}

  verifyToken(params: { token: string; ignoreExpiration?: boolean }) {
    try {
      const { token, ignoreExpiration } = params;
      return jwt.verify(token, this._config.parsed().TOKEN_SECRET, {
        ignoreExpiration,
      }) as TokenPayload;
    } catch (err) {
      throw err;
    }
  }
}
