import { FastifyPluginCallback, fastify } from "fastify";
import { registerRoutes } from "../controllers/routesController.ts";
import fastifyCors from "@fastify/cors";
import "dotenv/config";

const server = fastify();

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
});

registerRoutes(server);

export { server };
