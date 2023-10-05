import { DatabasePostgres } from "../models/databasePostgres.js";

const database = new DatabasePostgres();

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
}
