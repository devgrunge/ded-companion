import { mongoClient } from "./config/db.ts";
import { CharacterModel } from "./models/characterModel.ts";
import { server } from "./server/server.ts";

const playerData = new CharacterModel();

const socketUserMap: Record<string, string> = {};
server.ready((err) => {
  if (err) throw err;

  server.io.on("connection", (socket: any) => {
    console.info("Socket connected!", socket.id);

    socket.on("user_email", async (userEmail: string) => {
      console.log(`Received user email ${userEmail} for socket ${socket.id}`);
      socketUserMap[socket.id] = userEmail;

      const database = mongoClient.db("dndcompanion");
      const players = database.collection("Players");
      const changeStream = players.watch();

      changeStream.on("change", async (next) => {
        if (next.fullDocument && next.fullDocument.userEmail) {
          const userObject = await playerData.list(next.fullDocument.userEmail);
          console.log('usr obj ==> ',userObject)
          server.io.to(socket.id).emit("user_updated", userObject);
        }
      });

      socket.on("disconnect", () => {
        console.info(`Socket disconnected! ${socket.id}`);
        changeStream.close();
        delete socketUserMap[socket.id];
      });
    });
  });
});

server.listen({ port: 3338 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
