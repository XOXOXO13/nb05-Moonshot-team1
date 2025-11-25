import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { IServices } from "../../inbound/ports/I-services";
import { Utils } from "../../shared/utils-interface";
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
