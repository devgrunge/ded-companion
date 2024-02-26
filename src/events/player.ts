import { FastifyInstance, FastifyRequest } from "fastify";
import { mongoClient } from "../config/db.ts";

export const EventsController = (server: FastifyInstance) => {
  server.get("/event-stream", (request, reply) => {
    reply.header("Content-Type", "text/event-stream");
    reply.header("Cache-Control", "no-cache");
    reply.header("Connection", "keep-alive");

    mongoClient.on("player-update", (event) => {
      const eventData = JSON.stringify(event);
      reply.raw.write(`event: player-update\n`);
      reply.raw.write(`data: ${eventData}\n\n`);
    });
  });
};
