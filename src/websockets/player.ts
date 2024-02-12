import { FastifyInstance } from "fastify";
import { CharacterModel } from "../models/characterModel.ts";

const database = new CharacterModel();

export const websocketController = (server: FastifyInstance) => {
  server.io.on("connection", (socket: any) => {
    console.info("Socket connected!", socket.id);
    socket.on("fetch_character_data", async (email: string) => {
      const playerData: [] = await database.list(email);
      console.info(playerData);
      if (playerData.length <= 0) {
        socket.emit("character_data", {
          error: "You don't have characters yet, create one first!",
        });
      } else {
        socket.emit("character_data", { data: playerData });
      }
    });
  });
};
