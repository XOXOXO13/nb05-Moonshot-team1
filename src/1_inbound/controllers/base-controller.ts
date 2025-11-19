import express from "express";
import { IServices } from "../../inbound/ports/I-services";
export class BaseController {
  private _basePath;
  private _services;
  private _router;

  constructor({
    basePath,
    services,
  }: {
    basePath: string;
    services: IServices;
  }) {
    this._basePath = basePath;
    this._services = services;
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
}
