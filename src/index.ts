import { httpServer, server } from "./server/server.ts";

server.listen({ port: 3338 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  httpServer.listen(3339);

  console.log(`Server listening at ${address}`);
});
