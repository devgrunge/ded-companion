import { FastifyInstance } from "fastify";
import authRoutes from "../routes/authRoutes.ts";
import roomRoutes from "../routes/roomRoutes.ts";
import characterRoutes from "../routes/characterRoutes.ts";
import dungeonMasterRoutes from "../routes/dungeonMasterRoutes.ts";

export const routesController = async (server: FastifyInstance) => {
  authRoutes(server);
  roomRoutes(server);
  characterRoutes(server);
  dungeonMasterRoutes(server);
  // todo: automate route registering
};
