import { FastifyInstance } from "fastify/types/instance.js";
import { EntityModel } from "../models/entitiesModel.js";
import { validateToken } from "../services/auth.js";
import { randomUUID } from "node:crypto";
import { mongoClient } from "../config/db.js";
import {
  CharacterData,
  CharacterParams,
  RouteInterface,
} from "./types/routeTypes.js";
import { FastifyRequest } from "fastify/types/request.js";
import { FastifyReply } from "fastify/types/reply.js";

const database = new EntityModel();

export const characterRoutes = async (server: FastifyInstance) => {
  server.post<RouteInterface>(
    "/characters",
    {
      preHandler: [validateToken],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as CharacterParams;
      const body: CharacterData = request.body as CharacterData;
      const dataId = randomUUID();
      try {
        const characterData: CharacterData = {
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

        const ownerEmail = params.user.email;

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
      const params = request.params as CharacterParams;
      const currentUserEmail = params.user?.email;

      if (currentUserEmail) {
        try {
          const characters = await database.list(currentUserEmail);
          return reply.send(characters);
        } catch (error) {
          console.error("Error listing characters:", error);
          reply.status(500).send({ error: "Internal server error" });
        }
      } else {
        reply.status(401).send({ error: "Unauthorized" });
      }
    }
  );

  server.put<RouteInterface>(
    "/characters/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const params = request.params as CharacterParams;
      const characterId = params.id;
      const body = request.body as CharacterData;

      const currentUserEmail = params.user.email;

      try {
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
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = request.params as CharacterParams;
      const characterId = params.id;
      const ownerEmail = params.user.email;

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
