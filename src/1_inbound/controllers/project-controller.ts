import { ProjectMiddleware } from "../middlewares/project-middleware";
import { BaseController } from "./base-controller";

export class ProjectContrller extends BaseController {
  constructor(middleware: ProjectMiddleware) {
    super("/projects");
  }

  register() {
    this.router.post(
      "/",
    );
    this.router.get(
      "/:projectId"
    );
    this.router.patch(
      "/:projectId"
    );
    this.router.delete(
      "/:projectId"
    );
  }
}
