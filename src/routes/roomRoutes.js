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
}
