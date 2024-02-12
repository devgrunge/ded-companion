import { FastifyInstance } from "fastify";
import { CharacterModel } from "../models/characterModel.ts";
import { mongoClient } from "../config/db.ts";

const database = new CharacterModel();

export const websocketController = (server: FastifyInstance) => {
  server.io.on("connection", (socket: any) => {
    // todo: ensure that each socket adds one listener at this event
    socket.on("fetch_character_data", async (email: string) => {
      const playerData: [] = await database.list(email, "ws");
      console.info(playerData);

      if (playerData.length <= 0) {
        socket.emit("character_data", {
          error: "You don't have characters yet, create one first!",
        });
      } else {
        socket.emit("character_data", { data: playerData });
      }
    });

    // const db = mongoClient.db("Player");
    // const changeStream = db.collection("Player").watch();

    // // Handle change events
    // // changeStream.on("change", (next) => {
    // //   // Process only update events, ignore insert events
    // //   if (next.operationType === "update") {
    // //     console.log("Character updated:", next.updateDescription.updatedFields);
    // //     socket.emit("character_updated", {
    // //       updatedFields: next.updateDescription.updatedFields,
    // //     });
    // //   }
    // // });

    // Clean up the change stream on socket disconnect
    socket.on("disconnect", () => {
      // changeStream.close();
      console.log("Socket disconnected!", socket.id);
    });
  });
};
