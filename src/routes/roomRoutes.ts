import { FastifyInstance } from "fastify/types/instance.ts";
import { InGameModel } from "../models/inGameModel.ts";
import { validateToken } from "../services/auth.ts";
import { RoomData, RoomRequest, RouteInterface } from "./types/routeTypes.ts";
import { FastifyRequest, FastifyReply } from "fastify";
import { Utils } from "../utils/index.ts";

const validation = new Utils();
const inGameDatabase = new InGameModel();

export const roomRoutes = async (server: FastifyInstance) => {
  server.post<RouteInterface>(
    "/rooms",
    {
      preHandler: [validateToken],
    },
    async (request, reply: FastifyReply) => {
      try {
        const body: RoomData = request.body as RoomData;
        const currentUserEmail = request.headers["user-email"] as string;

        const roomExists = await inGameDatabase.roomExists(
          body.room_name,
          currentUserEmail
        );
        if (roomExists !== null) {
          return reply
            .status(400)
            .send({ error: "Cant create rooms with the same name" });
        }

        const createdRoom: Object | null = await inGameDatabase.createRoom({
          room_name: body.room_name,
          owner: currentUserEmail,
        });

        if (createdRoom) {
          console.log("Room was successfully created:", createdRoom);
          return reply.status(201).send({ created: createdRoom });
        } else {
          console.log("Room creation failed.");
          return reply.status(500).send({ error: "Room creation failed" });
        }
      } catch (error) {
        console.error("Error creating room:", error);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
  server.get<RouteInterface>(
    "/rooms/:inviteCode",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const inviteCode = (request as RoomRequest).params.inviteCode;

      try {
        const room = await inGameDatabase.getRoomByInviteCode(inviteCode);

        if (!room) {
          reply.status(404).send({ error: "Room not found" });
          return;
        }

        return reply.status(200).send({ success: room } as any);
      } catch (error) {
        console.error("Error getting room:", error);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  server.put<RouteInterface>(
    "/rooms/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const roomId = (request as RoomRequest).params.id;
      const body: RoomData = request.body as RoomData;

      console.log("roomid: ", roomId);
      try {
        const updatedRoom = await inGameDatabase.updateRoom(roomId, {
          room_name: body.room_name,
        });

        if (!updatedRoom) {
          reply.status(404).send({ error: "Room not found" });
          return;
        }

        reply.status(204).send({ updated: "Room updated sucessfully" });
      } catch (error) {
        console.error("Error updating Room:", error);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  server.delete<RouteInterface>(
    "/rooms/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const roomId: string = (request as RoomRequest).params.id;

      try {
        const result = await inGameDatabase.deleteRoom(roomId);

        if (result.deletedCount === 1) {
          return reply
            .status(204)
            .send({ updated: "Room deleted Sucessfully" });
        } else {
          return reply.status(404).send({ error: "Room not found" });
        }
      } catch (error) {
        console.error("Error deleting room: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  // Handling relationship between rooms and players
  server.post<RouteInterface>(
    "/rooms/enter",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const { player_id, room_id, character_id } = request.body as RoomData;
        const currentUserEmail = request.headers["user-email"] as string;

        const roomExists = await inGameDatabase.roomExists(
          room_id as string,
          currentUserEmail
        );
        if (!roomExists) {
          return reply.status(404).send({ error: "Room not found" });
        }

        const characterBelongsToPlayer =
          await inGameDatabase.characterBelongsToPlayer(
            player_id,
            character_id
          );

        const playerNames = await validation.getUserNames(room_id);

        const isNameUnique = await validation.validatePlayerNamesInRoom(
          room_id,
          playerNames
        );

        if (!characterBelongsToPlayer || !isNameUnique) {
          return reply.status(403).send({
            error: `Character can't enter, server returned ${
              (characterBelongsToPlayer &&
                "Character don't belongs to player") ||
              (isNameUnique && "Player with the same name in room")
            }`,
          });
        }

        const roomStatus = await inGameDatabase.enterRoom(
          player_id,
          room_id,
          character_id
        );

        return reply
          .status(201)
          .send({ created: "Player has entered the room" });
      } catch (error) {
        console.error("Error at entering this room: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  server.delete<RouteInterface>(
    "/rooms/leave",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const body = request.body as RoomRequest;

        const room = await inGameDatabase.leaveRoom(
          body.room_id,
          body.character_id as string
        );

        if (!room) {
          return reply.status(404).send({ error: "Room not found" });
        }

        return reply
          .status(204)
          .send({ updated: "Character deleted sucessfully" });
      } catch (error) {
        console.error("Error deleting character from room: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  server.get<RouteInterface>(
    "/rooms/players/:room_id",
    {
      preHandler: [validateToken],
    },
    async (request, reply: FastifyReply) => {
      try {
        const roomId = (request as RoomRequest).params.room_id;

        const playersInRoom = await inGameDatabase.getPlayersInRoom(roomId);

        return reply.status(200).send(playersInRoom);
      } catch (error) {
        console.error("Error fetching players in room: ", error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );
};
