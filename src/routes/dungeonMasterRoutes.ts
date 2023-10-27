import { FastifyInstance } from "fastify/types/instance.ts";
import { validateToken } from "../services/auth.ts";
import {
  DmData,
  DungeonMasterRequest,
  RouteInterface,
} from "./types/routeTypes.ts";
import { FastifyReply } from "fastify/types/reply.ts";
import { DmModel } from "../models/dmModel.ts";

const database = new DmModel();

export const dungeonMasterRoutes = async (server: FastifyInstance) => {
  server.post<RouteInterface>(
    "/dungeon-master",
    {
      preHandler: [validateToken],
    },
    async (request, reply: FastifyReply) => {
      const body = request.body as DmData;

      try {
        await database.create({
          dm_name: body.dm_name,
        });
        return reply.status(204).send({ success: "Dm created sucessfully" });
      } catch (error) {
        console.error("Error creating Dungeon master:", error);
        reply.status(500).send({ error: "Internal server error" });
      }
    }
  );

  server.get<DungeonMasterRequest>(
    "/dungeon-master",
    {
      preHandler: [validateToken],
    },
    async (request, reply: FastifyReply) => {
      const search = request.query.search;
      try {
        const data = await database.list(search);
        return data;
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  server.put<DungeonMasterRequest>(
    "/dungeon-master/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply: FastifyReply) => {
      const dmId = request.params.id;
      const body = request.body as DmData;

      try {
        await database.update(dmId, {
          dm_name: body.dm_name,
        });
        return reply.status(204).send({ success: "Dm updated sucessfully" });
      } catch (error) {
        console.error("Error updating Dungeon master:", error);
        reply.status(400).send({ error: "Id does not exist" });
      }
    }
  );

  server.delete<DungeonMasterRequest>(
    "/dungeon-master/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      const dmId = request.params.id;

      try {
        await database.delete(dmId);

        return reply.status(204).send();
      } catch (error) {
        console.error("Error deleting Dungeon master:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
};
