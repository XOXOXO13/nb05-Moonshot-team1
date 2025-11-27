import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { BaseController } from "./base-controller";
import { IServices } from "../ports/I-services";
import { Response, Request } from "express";

export class FileController extends BaseController {
  #fileUploader: multer.Multer;

  constructor(services: IServices) {
    super({ basePath: "/files", services: services });

    // 모든 파일 업로드 허용
    this.#fileUploader = multer({
      storage: multer.memoryStorage(),
    });

    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post(
      "/",
      this.#fileUploader.array("files"),
      this.catch(this.fileUpload),
    );
  }

  fileUpload = async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[] | undefined;
    const urls: string[] = [];

    if (files && files.length > 0) {
      // 업로드 경로 생성
      const uploadDir = path.join("public", "files");
      await fs.mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        const filename = `${Date.now()}_${file.originalname}`;
        const uploadPath = path.join(uploadDir, filename);

        // memoryStorage → buffer 사용
        await fs.writeFile(uploadPath, file.buffer);

        urls.push(`public/files/${filename}`);
      }
    }
    // res.status(200).json({ urls });
    res.status(200).json();
  };
}
