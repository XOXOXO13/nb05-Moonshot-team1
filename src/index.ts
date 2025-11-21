import dotenv from "dotenv";
import { DependencyInjector } from "./injector";

dotenv.config({ path: ".env.dev" });

const { server } = new DependencyInjector();
server.run();
