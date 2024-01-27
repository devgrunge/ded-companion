import { fastify } from "fastify";
import { registerRoutes } from "../controllers/routesController.ts";
import { Server } from "socket.io";
import fastifyCors from "@fastify/cors";
import fastifySocketIO from "../websockets/index.ts";
import "dotenv/config";

const server = fastify();

 server.register(fastifySocketIO, {
  cors: {
    origin: '*'
  }
});

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
});

registerRoutes(server);

declare module "fastify" {
  interface FastifyInstance {
    io: Server<{ method: string }>;
  }
}


export { server };
