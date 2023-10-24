import { FastifyInstance } from "fastify/types/instance.js";
import { EntityModel } from "../models/entitiesModel.js";
import { validateToken } from "../services/auth.js";
import { DmData, RouteInterface } from "./types/routeTypes.js";
import { FastifyRequest } from "fastify/types/request.js";
import { FastifyReply } from "fastify/types/reply.js";

const database = new EntityModel();

export const dungeonMasterRoutes = async (server: FastifyInstance) => {
  server.post<RouteInterface>(
    "/dungeon-master",
    {
      preHandler: [validateToken],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
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
    }
  );

  server.get(
    "/dungeon-master",
    {
      preHandler: [validateToken],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const search = request.query.search;
      try {
        const data = await database.list(search, "dungeon_master");
        return data;
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  server.put(
    "/dungeon-master/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const dmId = request.params.id;
      const body = request.body as DmData;

      try {
        await database.update(dmId, {
          dm_name: body.dm_name,
        });
        return reply.status(204).send();
      } catch (error) {
        console.error("Error updating Dungeon master:", error);
        response.status(400).send("Id does not exist");
      }
    }
  );

  server.delete(
    "/dungeon-master/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const dmId = request.params.id;

      try {
        await database.delete(dmId, "dungeon_master");

        return reply.status(204).send();
      } catch (error) {
        console.error("Error deleting Dungeon master:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
};
