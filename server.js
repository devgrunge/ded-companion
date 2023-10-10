import { fastify } from "fastify";
import { characterRoutes } from "./src/routes/characterRoutes.js";
import { roomRoutes } from "./src/routes/roomRoutes.js";
import { dungeonMasterRoutes } from "./src/routes/dungeonMasterRoutes.js";
import { authRoutes } from "./src/routes/authRoutes.js";
import "dotenv/config";
import { authService, tokenVerification } from "./src/services/auth.js";

const server = fastify();
//JWT Auth
authRoutes(server);
authService(server);
tokenVerification.validateToken(server);

//Game Routes
characterRoutes(server);
roomRoutes(server);
dungeonMasterRoutes(server);

server.listen({
  host: "0.0.0.0",
  port: process.env.PORT ?? 3333,
});
