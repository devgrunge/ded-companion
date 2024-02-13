import { FastifyInstance } from "fastify";
import { CharacterModel } from "../models/characterModel.ts";

const database = new CharacterModel();

export const websocketController = (server: FastifyInstance) => {
  server.io.on("connection", (socket: any) => {
    let intervalId: NodeJS.Timeout;

    socket.on("fetch_character_data", async (email: string) => {
      intervalId = setInterval(async () => {
        const playerData = await database.list(email, "ws");
        console.info(playerData);

        if (playerData.length <= 0) {
          socket.emit("character_data", {
            error: "You don't have characters yet, create one first!",
          });
        } else {
          socket.emit("character_data", { data: playerData });
        }
      }, 5000); // Fetch data every 5 seconds

      // Initial fetch when the socket connects
      const playerData = await database.list(email, "ws");
      console.info(playerData);

      if (playerData.length <= 0) {
        socket.emit("character_data", {
          error: "You don't have characters yet, create one first!",
        });
      } else {
        socket.emit("character_data", { data: playerData });
      }
    });

    // Clean up the interval on socket disconnect
    socket.on("disconnect", () => {
      clearInterval(intervalId);
      console.log("Socket disconnected!", socket.id);
    });
  });
};
