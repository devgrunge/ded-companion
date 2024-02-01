import { fastify } from "fastify";
import { registerRoutes } from "../controllers/routesController.ts";
import fastifyCors from "@fastify/cors";
import "dotenv/config";

const server = fastify();

server.register(require("fastify-websocket"), {
  cors: {
    origin: "*",
  },
});

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
});

registerRoutes(server);
export { server };
