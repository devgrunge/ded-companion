import { fastify } from "fastify";
import { DatabaseMemory } from "./databaseMemory.js";

const server = fastify();

const database = new DatabaseMemory();

server.post("/characters", (request, reply) => {
  const body = request.body;

  database.create({
    name: body.name,
    level: body.level,
    class: body.class,
  });

  console.log(database.list());

  return reply.status(201).send();
});

server.get("/characters", (request, reply) => {
  const search = request.query.search;
  const data = database.list(search);
  return data;
});

server.put("/characters/:id", (request, reply) => {
  const characterId = request.params.id;
  const body = request.body;

  database.update(characterId, {
    name: body.name,
    level: body.level,
    class: body.class,
  });

  return reply.status(204).send();
});

server.delete("/characters/:id", (request, reply) => {
  const characterId = request.params.id;

  database.delete(characterId);

  return reply.status(204).send();
});

server.listen({
  port: 3333,
});
