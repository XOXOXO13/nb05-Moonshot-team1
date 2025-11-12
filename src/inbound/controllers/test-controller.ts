import { Request, Response } from "express";
import { IServices } from "../ports/I-services";
import { BaseController } from "./base-controller";

export class TestController extends BaseController {
  constructor(services: IServices) {
    super({ basePath: "/test", services: services });
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get("/", this.getTest);
  }

  getTest = (req: Request, res: Response) => {
    const data = this.services.testService.getTest();
    res.json(data);
  };
}
