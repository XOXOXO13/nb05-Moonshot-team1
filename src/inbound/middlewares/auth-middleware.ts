import { NextFunction, Request, Response } from "express";

export class AuthMiddleware {
  constructor() {}

  isUser = (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.Authorization;
    if(!authHeader){
      // Authorization 가 없다는 에러
      throw new Error;
    }
    const accessToken = authHeader.split(" ")[1];
    const payload = 
  }
}
