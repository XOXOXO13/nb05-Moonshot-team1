import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { IServices } from "../ports/I-services";
import { Utils } from "../../shared/utils-interface";
import z from "zod"

export class BaseController {
  private _basePath;
  private _services;
  private _utils;
  private _router;

  constructor({
    basePath,
    services,
    utils,
  }: {
    basePath: string;
    services: IServices;
    utils?: Utils;
  }) {
    this._basePath = basePath;
    this._services = services;
    this._utils = utils;
    this._router = express.Router();
  }

  get basePath() {
    return this._basePath;
  }

  get router() {
    return this._router;
  }

  get services(): IServices {
    return this._services;
  }

  validate<T extends z.ZodType>(schema: T, data: unknown) {
    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      // throw new BusinessException({
      //   type: BusinessExceptionType.INVALIDE_EMAIL,
      //   message: parsedData.error.issues[0].message,
      // });
      throw new Error("잘못된 요청 형식입니다.");
    }

    return parsedData.data;
  }


  get utils(): Utils | undefined {
    return this._utils;
  }
  catch(handler: RequestHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }
}
