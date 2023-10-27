import { fastify } from "fastify";
import { characterRoutes } from "../routes/characterRoutes.ts";
import { roomRoutes } from "../routes/roomRoutes.ts";
import { dungeonMasterRoutes } from "../routes/dungeonMasterRoutes.ts";
import { authRoutes } from "../routes/authRoutes.ts";
import "dotenv/config";

console.log("Hey darling :)");
const server = fastify();
authRoutes(server);
characterRoutes(server);
roomRoutes(server);
dungeonMasterRoutes(server);

export { server };
