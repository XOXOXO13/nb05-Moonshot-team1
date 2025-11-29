import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { IServices } from "../ports/I-services";
import { Utils } from "../../shared/utils-interface";
import z from "zod";
import { BusinessException, BusinessExceptionType, INPUT_EXCEPTIONS } from "../../shared/exceptions/business-exception";

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

      // default 에러
      let errorType = BusinessExceptionType.INVALID_REQUEST;  

      // 입력값에 대한 에러
      const inputError: string = parsedData.error.issues[0].path[0].toString(); 
      console.log(inputError);
      if (Object.keys(INPUT_EXCEPTIONS).includes(inputError)) {
        errorType = INPUT_EXCEPTIONS[inputError]
        console.log(errorType);
      }

      throw new BusinessException({ type : errorType });
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
