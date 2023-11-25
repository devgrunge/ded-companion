import { FastifyInstance } from "fastify";
import authRoutes from "../routes/authRoutes.ts";
import roomRoutes from "../routes/roomRoutes.ts";
import characterRoutes from "../routes/characterRoutes.ts";
import dungeonMasterRoutes from "../routes/dungeonMasterRoutes.ts";

export const registerRoutes = async (server: FastifyInstance) => {
  authRoutes(server);
  roomRoutes(server);
  characterRoutes(server);
  dungeonMasterRoutes(server);
};
