import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import { routesController } from "../controllers/routesController.ts";
import { websocketController } from "../websockets/player.ts";
import fastifyCors from "@fastify/cors";
import fastifyAccepts from "@fastify/accepts";
import fastifySocketIO from "../websockets/index.ts";
import "dotenv/config";

fastifyCors[Symbol.for("plugin-meta")].fastify = "3.x - 4.x";
fastifyAccepts[Symbol.for("plugin-meta")].fastify = "3.x - 4.x";

const server: FastifyInstance = fastify({
  logger: true,
} as FastifyServerOptions);

server.register(fastifySocketIO);

server.ready((err) => {
  if (err) throw err;

  server.io.on("connection", (socket: any) => websocketController(server));
});

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
  credentials: true,
});

routesController(server);
export { server };
