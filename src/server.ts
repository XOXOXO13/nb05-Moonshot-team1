import express from "express";
import cors from "cors";
import morgan from "morgan";

export class Server {
  private _app;
  private _controllers;

  constructor(controllers: any) {
    this._app = express();
    this._controllers = controllers;
  }

  registerMiddlewares() {
    this._app.use(cors());
    this._app.use(morgan("dev"));
    this._app.use(express.json());
  }

  registerControllers() {
    for (const controller of this._controllers) {
      this._app.use(controller.basePath, controller.router);
    }
  }

  listen() {
    this._app.listen(3000, () => {
      console.log("listening on port 3000");
    });
  }

  run() {
    this.registerMiddlewares();
    this.registerControllers();
    this.listen();
  }
}
