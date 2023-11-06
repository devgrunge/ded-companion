import { FastifyInstance } from "fastify/types/instance.ts";
import { validateToken } from "../services/auth.ts";
import { DmParams, RoomData, RouteInterface } from "./types/routeTypes.ts";
import { DmModel } from "../models/dmModel.ts";
import { InGameModel } from "../models/inGameModel.ts";

const database = new DmModel();
const inGameDatabase = new InGameModel();

export const dungeonMasterRoutes = async (server: FastifyInstance) => {
  server.post<RouteInterface>(
    "/dm/enter",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const body = request.body as DmParams;
        const currentUserEmail = request.headers["user-email"] as string;

        if (!body.isDm) {
          reply.status(400).send({ error: "This user is not a Dm" });
        }

        const roomExists = await inGameDatabase.roomExists(
          body.room_id as string,
          currentUserEmail
        );

        console.log("room exists ===>", roomExists);

        if (!roomExists) {
          return reply.status(404).send({ error: "Room not found" });
        }

        const enterRoom = database.enterRoom(body);
        if (!enterRoom) {
          reply.status(400).send({ error: "Internal server error" });
        }

        return reply.status(204).send({ updated: "Dm entered in the room" });
      } catch (error) {
        console.error("Internal server error: ", error);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
  server.get<RouteInterface>(
    "/dm",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const RoomData = request.body as RoomData;
        console.log("My room data: ",RoomData)
        const dungeonMaster = await inGameDatabase.getDungeonMasterInRoom(
          RoomData
        );
        if (!RoomData) {
          throw new Error("Property is required");
        }

        return reply.status(204).send({ updated: `Dm is:  ${dungeonMaster}` });
      } catch (error) {
        console.error("internal server error");
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
};
