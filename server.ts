import { fastify } from "fastify";
import { characterRoutes } from "./src/routes/characterRoutes.ts";
import { roomRoutes } from "./src/routes/roomRoutes.ts";
import { dungeonMasterRoutes } from "./src/routes/dungeonMasterRoutes.ts";
import { authRoutes } from "./src/routes/authRoutes.ts";
import "dotenv/config";

console.log("Hey darling :)");
const server = fastify();
authRoutes(server);
characterRoutes(server);
roomRoutes(server);
dungeonMasterRoutes(server);

server.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
