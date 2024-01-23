import { fastify } from "fastify";
import { registerRoutes } from "../controllers/routesController.ts";
import fastifyCors from "@fastify/cors";
import fastifySocketIO from "fastify-socket.io";
import { createServer } from "node:http";
import { Server } from "socket.io";
import "dotenv/config";

const server = fastify();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
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

export { server, io, httpServer };
