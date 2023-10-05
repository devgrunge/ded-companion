import { DatabasePostgres } from "../models/databasePostgres.js";

const database = new DatabasePostgres();

export async function dungeonMasterRoutes(server) {
  server.post("/dungeon-master", async (request, reply) => {
    const body = request.body;

    try {
      await database.create(
        {
          dm_name: body.dm_name,
        },
        "dungeon_master"
      );
      return reply.status(204).send();
    } catch (error) {
      console.error("Error creating Dungeon master:", error);
      response.status(500).send("Internal server error");
    }
  });

  server.get("/dungeon-master", async (request, reply) => {
    const search = request.query.search;
    try {
      const data = await database.list(search, "dungeon_master");
      return data;
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  server.put("/dungeon-master/:id", async (request, reply) => {
    const dmId = request.params.id;
    const body = request.body;

    try {
      await database.update(
        dmId,
        {
          dm_name: body.dm_name,
        },
        "dungeon_master"
      );
      return reply.status(204).send();
    } catch (error) {
      console.error("Error updating Dungeon master:", error);
      response.status(400).send("Id does not exist");
    }
  });

  server.delete("/dungeon-master/:id", async (request, reply) => {
    const dmId = request.params.id;

    try {
      await database.delete(dmId, "dungeon_master");

      return reply.status(204).send();
    } catch {
      console.error("Error deleting Dungeon master:", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
