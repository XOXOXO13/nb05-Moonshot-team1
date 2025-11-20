import { NextFunction, Request, Response } from "express";
import { IUtils } from "../../shared/utils-interface";

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    // userId를 옵셔널 속성으로 추가
  }
}

export class AuthMiddleware {
  constructor(private _utils: IUtils) {}

  isUser = (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.Authorization;
    if(!authHeader || typeof authHeader !== 'string'){
      throw new Error;
    }
    const accessToken = authHeader.split(" ")[1];
    const payload = this._utils.token.verifyToken({token: accessToken});
    req.userId =payload.userId;
    return next();
  }
}
