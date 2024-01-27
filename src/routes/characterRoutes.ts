import { FastifyInstance } from "fastify/types/instance.ts";
import { CharacterModel } from "../models/characterModel.ts";
import { validateToken } from "../services/auth.ts";
import { randomUUID } from "node:crypto";
import { mongoClient } from "../config/db.ts";
import { CharacterParams, RouteInterface } from "./types/routeTypes.ts";
import { FastifyReply } from "fastify/types/reply.ts";
import { FastifyRequest } from "fastify";
import { CharacterData } from "../models/types/modelTypes.ts";

const database = new CharacterModel();

const characterRoutes = async (server: FastifyInstance) => {
  server.post<RouteInterface>(
    "/characters",
    {
      preHandler: [validateToken],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body: CharacterData = request.body as CharacterData;
        const dataId = randomUUID();
        const characterData: CharacterData = {
          id: dataId,
          name: body.name,
          level: body.level,
          class: body.class,
          attributes: {
            str: body.attributes.str,
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

        const ownerEmail = request.headers["user-email"] as string;

        const updatedPlayer = await database.create(ownerEmail, characterData);

        return reply.status(201).send({ created: updatedPlayer });
      } catch (error) {
        console.error("Error creating character: ", error);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  server.get<RouteInterface>(
    "/characters",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const currentUserEmail = request.headers["user-email"] as string;
      try {
        if (currentUserEmail) {
          const characters = await database.list(currentUserEmail);

          return reply.status(201).send(characters);
        } else {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        console.error("Error listing characters:", error);
        reply.status(500).send({ error: `Internal server error ${error}` });
      }
    }
  );

  server.put<RouteInterface>(
    "/characters/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const params = request.params as CharacterParams;
        const characterId = params.id;
        const body = request.body as CharacterData;
        const currentUserEmail = request.headers["user-email"] as string;
        const db = mongoClient.db("dndcompanion");
        const collection = db.collection("Players");

        const player = await collection.findOne({ email: currentUserEmail });

        if (player && player.characters) {
          const updatedCharacters = player.characters.map(
            (character: CharacterData) => {
              if (character.id === characterId) {
                return {
                  id: characterId,
                  name: body.name,
                  level: body.level,
                  class: body.class,
                  attributes: {
                    str: body.attributes.str,
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
            }
          );

          await collection.updateOne(
            { email: currentUserEmail },
            { $set: { characters: updatedCharacters } }
          );

          return reply.status(204).send({ updated: updatedCharacters });
        } else {
          return reply
            .status(400)
            .send({ error: "Character not found or unauthorized." });
        }
      } catch (error) {
        console.error("Error updating character: ", error);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  server.delete<RouteInterface>(
    "/characters/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const params = request.params as CharacterParams;
      const characterId = params.id;
      const ownerEmail = request.headers["user-email"] as string;

      try {
        const success = await database.delete(characterId, ownerEmail);

        if (success) {
          return reply
            .status(204)
            .send({ updated: "Character deleted sucessfull" });
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
};

export default characterRoutes;
