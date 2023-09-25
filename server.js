import { fastify } from "fastify";
import { DatabasePostgres } from "./databasePostgres.js";
import { DatabaseMemory } from "./databaseMemory.js";

const server = fastify();

const database = new DatabasePostgres();

server.post("/characters", async (request, reply) => {
  const body = request.body;

  await database.create({
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
    armor_class: body.armor_class
  });

  console.log(database.list());

  return reply.status(201).send();
});

server.get("/characters", async (request, reply) => {
  const search = request.query.search;
  const data = await database.list(search);
  return data;
});

server.put("/characters/:id", async (request, reply) => {
  const characterId = request.params.id;
  const body = request.body;

  await database.update(characterId, {
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
  host: "0.0.0.0",
  port: process.env.PORT ?? 3333,
});
