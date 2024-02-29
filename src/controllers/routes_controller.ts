import { FastifyInstance } from "fastify";
import RoomRoutes from "../routes/room_routes.ts";
import AuthRoutes from "../routes/auth_routes.ts";
import CharacterRoutes from "../routes/character_routes.ts";
import DungeonMasterRoutes from "../routes/dungeon_maste_routes.ts";

export const RoutesController = async (server: FastifyInstance) => {
  AuthRoutes(server);
  RoomRoutes(server);
  CharacterRoutes(server);
  DungeonMasterRoutes(server);
  // todo: automate route registering
};
