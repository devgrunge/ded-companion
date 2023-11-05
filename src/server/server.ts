import { fastify } from "fastify";
import { characterRoutes } from "../routes/characterRoutes.ts";
import { roomRoutes } from "../routes/roomRoutes.js";
import { dungeonMasterRoutes } from "../routes/dungeonMasterRoutes.ts";
import { authRoutes } from "../routes/authRoutes.ts";
import "dotenv/config";

const server = fastify();
authRoutes(server);
characterRoutes(server);
roomRoutes(server);
dungeonMasterRoutes(server);

export { server };
