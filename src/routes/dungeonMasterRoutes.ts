import { FastifyInstance } from "fastify/types/instance.ts";
import { validateToken } from "../services/auth.ts";
import {
  DmParams,
  DungeonMasterRequest,
  RoomData,
  RouteInterface,
} from "./types/routeTypes.ts";
import { DmModel } from "../models/dmModel.ts";
import { InGameModel } from "../models/inGameModel.ts";
import {
  Player,
  UpdatePlayersRequestBody,
} from "../models/types/modelTypes.ts";

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
    "/dm/:roomId",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const room_id = (request as unknown as DungeonMasterRequest).params
          ?.roomId;

        if (!room_id) {
          return reply.status(400).send({ error: "Dm not found" });
        }

        const dungeonMaster = await inGameDatabase.getDungeonMasterInRoom(
          room_id
        );

        return reply
          .status(200)
          .send({ success: `Dm is:  ${dungeonMaster.name}` });
      } catch (error) {
        console.error("internal server error");
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
  server.get<RouteInterface>(
    "/players/:roomId",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const room_id = (request as unknown as DungeonMasterRequest).params
          ?.roomId;

        const getPlayers = await inGameDatabase.getPlayersInRoom(room_id);

        if (!getPlayers) {
          return reply.status(400).send({ error: "Players not found" });
        }
        const allPlayers = await getPlayers?.map(
          (item: Player) => item.character?.name
        );

        return reply
          .status(200)
          .send({ success: `Players in room ${allPlayers.join(", ")}` });
      } catch (error) {
        console.error("Internal server error", error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
  server.post<RouteInterface>(
    "/update-players/:roomId",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const body = request.body as UpdatePlayersRequestBody;
        const roomId = (request as unknown as DungeonMasterRequest).params
          ?.roomId as string;

        const { playerName, updatedData } = body;

        const result = await inGameDatabase.updateCharacterData(
          roomId,
          playerName,
          updatedData
        );

        return reply
          .status(200)
          .send({ success: `Character updated, ${result.name}` });
      } catch (error) {
        console.error("Internal server error", error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
};
