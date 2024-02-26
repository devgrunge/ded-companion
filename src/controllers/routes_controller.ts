import { FastifyInstance } from "fastify";
import RoomController from "../routes/room_controller.ts";
import AuthController from "../routes/authRoutes.ts";
import CharacterController from "../routes/characterRoutes.ts";
import DungeonMasterController from "../routes/dungeonMasterRoutes.ts";

export const RoutesController = async (server: FastifyInstance) => {
  AuthController(server);
  RoomController(server);
  CharacterController(server);
  DungeonMasterController(server);
  // todo: automate route registering
};
