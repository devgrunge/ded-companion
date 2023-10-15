import { EntityModel } from "../models/entitiesModel.js";
import { validateToken } from "../services/auth.js";
import { randomUUID } from "node:crypto";

const database = new EntityModel();

export async function characterRoutes(server) {
  server.post(
    "/characters",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const body = request.body;
      const dataId = randomUUID();
      try {
        await database.create(
          {
            id: dataId,
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
            owner: body.owner,
          },
          "player"
        );
        // console.log(database.list());
        return reply.status(201).send(database.list);
      } catch (error) {
        console.error("Error creating character: ", error);
        response.status(500).send("Internal server error");
      }
    }
  );

  server.get(
    "/characters",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const search = request.query.search;
      console.log(request)
      try {
        if(search){
          const data = await database.list(search, "player");
          return reply.status(200).send({ characters: data });
        }else{
          const data = await database.list("player");
          return reply.status(200).send({ characters: data }); 
        }
      } catch (error) {
        console.error("Error searching character: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  server.put(
    "/characters/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
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
      } catch (error) {
        console.error("Error updating character: ", error);
        response.status(400).send("Id does not exist");
      }
    }
  );

  server.delete(
    "/characters/:id",
    {
      preHandler: [validateToken],
    },
    (request, reply) => {
      const characterId = request.params.id;
      try {
        database.delete(characterId, "player");

        return reply.status(204).send();
      } catch (error) {
        console.error("Error deleting character: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
