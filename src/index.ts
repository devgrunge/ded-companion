import { server } from "./server/server.ts";
import cors from "@fastify/cors";

server.register(cors);

server.listen({ port: 3338 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
