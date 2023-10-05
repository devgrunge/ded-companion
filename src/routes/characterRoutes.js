import { DatabasePostgres } from "../models/databasePostgres.js";

const database = new DatabasePostgres();

export async function characterRoutes(server) {
  server.post("/characters", async (request, reply) => {
    const body = request.body;

    try {
      await database.create(
        {
          name: body.name,
          level: body.level,
          class: body.class,
          attributes: {
            for: body.attributes.for,
            dex: body.attributes.dex,
            con: body.attributes.con,
            int: body.attributes.int,
            wis: body.attributes.wis,
            car: body.attributes.car,
          },
          hitpoints: body.hitpoints,
          armor_class: body.armor_class,
        },
        "player"
      );
      console.log(database.list());
      return reply.status(201).send();
    } catch (error) {
      console.error("Error creating character: ", error);
      response.status(500).send("Internal server error");
    }
  });

  server.get("/characters", async (request, reply) => {
    const search = request.query.search;
    try {
      const data = await database.list(search, "player");
      return data;
    } catch (error) {
      console.error("Error searching character: ", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  server.put("/characters/:id", async (request, reply) => {
    const characterId = request.params.id;
    const body = request.body;

    try {
      await database.update(
        characterId,
        {
          name: body.name,
          level: body.level,
          class: body.class,
          attributes: {
            for: body.attributes.for,
            dex: body.attributes.dex,
            con: body.attributes.con,
            int: body.attributes.int,
            wis: body.attributes.wis,
            car: body.attributes.car,
          },
          hitpoints: body.hitpoints,
          armor_class: body.armor_class,
        },
        "player"
      );
      return reply.status(204).send();
    } catch {
      console.error("Error updating character: ", error);
      response.status(400).send("Id does not exist");
    }
  });

  server.delete("/characters/:id", (request, reply) => {
    const characterId = request.params.id;
    try {
      database.delete(characterId, "player");
      
      return reply.status(204).send();
    } catch (error) {
      console.error("Error deleting character: ", error);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  });
}
