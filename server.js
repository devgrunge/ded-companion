import { fastify } from "fastify";
import { characterRoutes } from "./src/routes/characterRoutes.js";
import { roomRoutes } from "./src/routes/roomRoutes.js";

const server = fastify();

characterRoutes(server); // registry of character routes
roomRoutes(server); // registry of room routes

server.listen({
  host: "0.0.0.0",
  port: process.env.PORT ?? 3333,
});
