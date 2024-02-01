import { mongoClient } from "./config/db.ts";
import { CharacterModel } from "./models/characterModel.ts";
import { server } from "./server/server.ts";

server.listen({ port: 3338 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
