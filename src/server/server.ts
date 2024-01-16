import { fastify } from "fastify";
import { registerRoutes } from "../controllers/routesController.ts";
import fastifyCors from "@fastify/cors";
import "dotenv/config";
import fastifySocketIO from "fastify-socket.io";

const server = fastify();

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
});

server.register(fastifySocketIO, {
  cors: {
    origin: "*",
  },
});

registerRoutes(server);

export { server };
