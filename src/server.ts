import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import multer from "multer";
import { BusinessException } from "./shared/exceptions/business-exception";
import { TechnicalException } from "./shared/exceptions/technical.exception";

export class Server {
  private _app: express.Application;
  private _controllers;
  private _port: number;

  constructor(
    controllers: any,
    port: number = parseInt(process.env.PORT || "4000", 10),
  ) {
    this._app = express();
    this._controllers = controllers;
    this._port = port;
  }

  registerMiddlewares() {
    const clientDomain = process.env.CLIENT_DOMAIN || "localhost:3000";
    this._app.use(
      cors({
        origin: [`http://${clientDomain}`, `http://127.0.0.1:3000`],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "x-auth-token",
          "x-access-token",
          "auth-token",
        ],
        exposedHeaders: ["Set-Cookie"],
        optionsSuccessStatus: 200,
      }),
    );
    this._app.use(cookieParser());
    this._app.use(express.json({ limit: "10mb" }));
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use("/public", express.static("public"));
    this._app.use(morgan("dev"));
    this._app.use(express.json());
  }

  registerErrorHandlers() {
    this._app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof BusinessException) {
          const { statusCode, message } = err;
          console.warn("@ Business Exception has occurred!");
          console.warn(err.message);
          return res.status(statusCode).json({ message });
        } else if (err instanceof TechnicalException) {
          console.warn("@ Technical Exception has occurred!");
          console.warn(err.message);
          return res.status(500).json(err.message);
        }
        console.warn("@ Internal Server Error (unknown error)");
        console.warn(err.message);
        return res.status(500).json(err.message);
      },
    );
  }

  registerControllers() {
    for (const controller of this._controllers) {
      this._app.use(controller.basePath, controller.router);
    }
  }

  listen() {
    this._app.listen(this._port, () => {
      console.log(`listening on port ${this._port}`);
    });
  }

  run() {
    this.registerMiddlewares();
    this.registerControllers();
    this.registerErrorHandlers();
    this.listen();
  }
  get app() {
    return this._app;
  }
}
