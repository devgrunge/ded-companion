import { fastify } from "fastify";
import { registerRoutes } from "../controllers/routesController.ts";
import "dotenv/config";

const server = fastify();
registerRoutes(server);

export { server };
