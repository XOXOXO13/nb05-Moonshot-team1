import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

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

    this._app.use(morgan("dev"));
    this._app.use(express.json());
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
    this.listen();
  }
  get app() {
    return this._app;
  }
}
