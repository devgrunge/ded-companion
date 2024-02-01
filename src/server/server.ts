import { fastify } from "fastify";
import { routesController } from "../controllers/routesController.ts";
import websocket from "@fastify/websocket";
import fastifyCors from "@fastify/cors";

import "dotenv/config";
import { websocketControler } from "../websockets/player.ts";

const server = fastify();

server.register(websocket);

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
});

websocketControler(server);
routesController(server);
export { server };
