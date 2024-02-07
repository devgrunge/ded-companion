import { fastify } from "fastify";
import fastifyIO from "fastify-socket.io";
import { routesController } from "../controllers/routesController.ts";
import fastifyCors from "@fastify/cors";
import { websocketController } from "../websockets/player.ts";
import "dotenv/config";

const server = fastify();

server.register(fastifyIO, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
});

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
  credentials: true,
});

websocketController(server);
routesController(server);
export { server };
