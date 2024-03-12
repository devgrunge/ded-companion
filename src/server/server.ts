import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import "dotenv/config";
import { RoutesController } from "../controllers/routes_controller.ts";
import fastifySocketIO from "../services/websockets/index.ts";
import { websocketController } from "../services/websockets/player.ts";
import fastifyCors from "@fastify/cors";
import fastifyAccepts from "@fastify/accepts";
import { EventsController } from "../events/player.ts";
import FastifySSEPlugin from "fastify-sse-v2";
// import { GptApi } from "../services/gpt-api/index.ts";

const corsPlugin: any = fastifyCors;
const acceptsPlugin: any = fastifyAccepts;

corsPlugin[Symbol.for("plugin-meta")].fastify = "3.x - 4.x";
acceptsPlugin[Symbol.for("plugin-meta")].fastify = "3.x - 4.x";

const server: FastifyInstance = fastify({
  logger: true,
} as FastifyServerOptions);

server.register(fastifySocketIO);

server.ready((err) => {
  if (err) throw err;

  server.io.on("connection", () => websocketController(server));
});

server.register(FastifySSEPlugin);

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
  credentials: true,
});

EventsController(server);
RoutesController(server);
// GptApi();
export { server };
