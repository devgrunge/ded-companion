import { EntityModel } from "../models/entitiesModel.js";
import { InGameModel } from "../models/inGameModel.js";

const database = new EntityModel();
const inGameDatabase = new InGameModel();

export async function roomRoutes(server) {
  server.post("/rooms", async (request, reply) => {
    const body = request.body;

    try {
      await database.create(
        {
          room_name: body.room_name,
        },
        "room"
      );
      return reply.status(204).send();
    } catch (error) {
      console.error("Error creating room:", error);
      response.status(500).send("Internal server error");
    }
  });

  server.get("/rooms", async (request, reply) => {
    const search = request.query.search;
    try {
      const data = await database.list(search, "room");
      return data;
    } catch (error) {
      console.error("Error listing Room: ", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  server.put("/rooms/:id", async (request, reply) => {
    const roomId = request.params.id;
    const body = request.body;

    try {
      await database.update(
        roomId,
        {
          room_name: body.room_name,
        },
        "room"
      );
      return reply.status(204).send();
    } catch (error) {
      console.error("Error updating Room:", error);
      response.status(400).send("Id does not exist");
    }
  });

  server.delete("/rooms/:id", async (request, reply) => {
    const roomId = request.params.id;

    try {
      database.delete(roomId, "room");

      return reply.status(204).send();
    } catch (error) {
      console.error("Error deleting room: ", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // Handling relationship between rooms and players
  server.post("/rooms/enter", async (request, reply) => {
    try {
      const { player_id, room_id } = request.body;

      await inGameDatabase.enterRoom(player_id, room_id);

      return reply
        .status(201)
        .send({ message: "Player has entered the room." });
    } catch (error) {
      console.error("Error at entering this room: ", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  server.delete("/rooms/leave", async (request, reply) => {
    try {
      const { player_id, room_id } = request.body;

      const existingEntry = await inGameDatabase.checkPlayerRoomRelationship(
        player_id,
        room_id
      );

      console.log("existing entry ==>",existingEntry)
      if (!existingEntry) {
        return reply.status(400).send({ error: "Player is not in the room." });
      }

      // Remove the player from the room
      await inGameDatabase.leaveRoom(player_id, room_id);
    } catch (error) {
      console.error("Error at leaving room: ", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  server.get("/rooms/players/:room_id",async (request, reply) =>{
    try{
      const roomId = request.params.room_id;

      const playersInRoom = await inGameDatabase.getPlayersInRoom(roomId)

      return reply.status(200).send(playersInRoom);
    }catch(error){
      console.error("Error fetching players in room: ", error);
      return reply.status(500).send({ error: "Internal server error" })
    }
  })
}
