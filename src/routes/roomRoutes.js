import { randomUUID } from "node:crypto";
import { EntityModel } from "../models/entitiesModel.js";
import { InGameModel } from "../models/inGameModel.js";
import { validateToken } from "../services/auth.js";
import { nanoid } from "nanoid";

const database = new EntityModel();
const inGameDatabase = new InGameModel();

export const roomRoutes = async (server) => {
  server.post(
    "/rooms",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const body = request.body;
      const roomId = randomUUID();
      const inviteCode = nanoid(4);

      try {
        const createdRoom = await inGameDatabase.create({
          room_id: roomId,
          room_name: body.room_name,
          inviteCode: inviteCode,
          players: [],
        });

        return reply.status(201).send(createdRoom);
      } catch (error) {
        console.error("Error creating room:", error);
        reply.status(500).send("Internal server error");
      }
    }
  );

  server.get(
    "/rooms/:inviteCode",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const inviteCode = request.params.inviteCode;

      try {
        const room = await inGameDatabase.getRoomByInviteCode(inviteCode);

        if (!room) {
          reply.status(404).send("Room not found");
          return;
        }

        return reply.status(200).send(room);
      } catch (error) {
        console.error("Error getting room:", error);
        reply.status(500).send("Internal server error");
      }
    }
  );

  server.put(
    "/rooms/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const roomId = request.params.id;
      const body = request.body;

      console.log("roomid: ", roomId);
      try {
        const updatedRoom = await inGameDatabase.updateRoom(roomId, {
          room_name: body.room_name,
        });

        console.log("updated room", updatedRoom);

        if (!updatedRoom) {
          reply.status(404).send("Room not found");
          return;
        }

        reply.status(204).send("Room updated sucessfully");
      } catch (error) {
        console.error("Error updating Room:", error);
        reply.status(500).send("Internal server error");
      }
    }
  );

  server.delete(
    "/rooms/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const roomId = request.params.id;

      try {
        const result = await inGameDatabase.deleteRoom(roomId);

        if (result.deletedCount === 1) {
          return reply.status(204).send("Room deleted Sucessfully");
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
  server.post(
    "/rooms/enter",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const { entity_id, room_id, character_id } = request.body;

        const roomExists = await inGameDatabase.roomExists(room_id);
        if (!roomExists) {
          return reply.status(404).send({ error: "Room not found" });
        }

        const characterBelongsToPlayer =
          await inGameDatabase.characterBelongsToPlayer(
            entity_id,
            character_id
          );

        if (!characterBelongsToPlayer) {
          return reply
            .status(403)
            .send({ error: "Character doesn't belong to the player" });
        }

        await inGameDatabase.enterRoom(entity_id, room_id, character_id);

        return reply
          .status(201)
          .send({ message: "Player has entered the room." });
      } catch (error) {
        console.error("Error at entering this room: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  server.delete(
    "/rooms/leave",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const { roomId, characterId } = request.body;

        const room = await inGameDatabase.leaveRoom(
          roomId,
          characterId
        );

        if (!room) {
          return reply.status(404).send({ error: "Room not found" });
        }

        return reply.status(204).send("Character deleted sucessfully");
      } catch (error) {
        console.error("Error deleting character from room: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  server.get(
    "/rooms/players/:room_id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const roomId = request.params.room_id;

        const playersInRoom = await inGameDatabase.getPlayersInRoom(roomId);

        return reply.status(200).send(playersInRoom);
      } catch (error) {
        console.error("Error fetching players in room: ", error);
        return reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  server.get(
    "/rooms/dungeon_masters/:room_id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const roomId = request.params.room_id;

        const dungeonMastersInRoom = await database.getDungeonMastersInRoom(
          roomId
        );

        return reply.status(200).send(dungeonMastersInRoom);
      } catch (error) {
        console.error("Error fetching dungeon masters in room: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
};
