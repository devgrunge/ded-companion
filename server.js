import { fastify } from "fastify";
import { characterRoutes } from "./src/routes/characterRoutes.js";
import { roomRoutes } from "./src/routes/roomRoutes.js";
import { dungeonMasterRoutes } from "./src/routes/dungeonMasterRoutes.js";

const server = fastify();
// routes registry
characterRoutes(server);
roomRoutes(server);
dungeonMasterRoutes(server);

server.listen({
  host: "0.0.0.0",
  port: process.env.PORT ?? 3333,
});
