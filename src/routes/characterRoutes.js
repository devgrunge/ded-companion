import { EntityModel } from "../models/entitiesModel.js";
import { validateToken } from "../services/auth.js";
import { randomUUID } from "node:crypto";
import { mongoClient } from "../config/db.js";

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
        const characterData = {
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
          initiative: 0,
        };

        const ownerEmail = request.user.email;

        const updatedPlayer = await database.create(ownerEmail, characterData);

        return reply.status(201).send(updatedPlayer);
      } catch (error) {
        console.error("Error creating character: ", error);
        reply.status(500).send("Internal server error");
      }
    }
  );

  server.get(
    "/characters",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const currentUserEmail = request.user.email;

      try {
        const characters = await database.list(currentUserEmail);
        return reply.send(characters);
      } catch (error) {
        console.error("Error listing characters:", error);
        reply.status(500).send("Internal server error");
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

      const currentUserEmail = request.user.email;

      try {
        const db = mongoClient.db("dndcompanion");
        const collection = db.collection("Players");

        const player = await collection.findOne({ email: currentUserEmail });

        if (player && player.characters) {
          const updatedCharacters = player.characters.map((character) => {
            if (character.id === characterId) {
              return {
                id: characterId,
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
                initiative: body.initiative,
              };
            }
            return character;
          });

          await collection.updateOne(
            { email: currentUserEmail },
            { $set: { characters: updatedCharacters } }
          );

          return reply.status(204).send();
        } else {
          return reply.status(400).send("Character not found or unauthorized.");
        }
      } catch (error) {
        console.error("Error updating character: ", error);
        reply.status(500).send("Internal server error");
      }
    }
  );

  server.delete(
    "/characters/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const characterId = request.params.id;
      const ownerEmail = request.user.email;

      try {
        const success = await database.delete(characterId, ownerEmail);

        if (success) {
          return reply.status(204).send("Character deleted sucessfull");
        } else {
          return reply
            .status(404)
            .send({ error: "Character not found or unauthorized" });
        }
      } catch (error) {
        console.error("Error deleting character: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
}
