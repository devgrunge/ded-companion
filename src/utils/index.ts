import { mongoClient } from "../config/db";
import { RoomsModel } from "../models/types/modelTypes";
import { PlayerParams } from "../routes/types/routeTypes";


export class Utils {
  
  async getUserNames(roomId: string | undefined) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    const room = await roomsCollection.findOne({ room_id: roomId });

    if (!room) {
      throw new Error("Room not found");
    }
  
    // Extract player names from the players array
    const playerNames = room.players.map((player : PlayerParams) => player.name);
    return playerNames;
  }
  async validatePlayerNamesInRoom(
    roomId: string | unknown,
    playerNames: string[] | undefined
  ): Promise<boolean> {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    const room = (await roomsCollection.findOne({
      room_id: roomId,
    })) as RoomsModel;

    if (!room) {
      throw new Error("Room not found");
    }

    const playerWithSameName = room.players.find(
      (player: PlayerParams) => player.name === playerNames
    );

    return !playerWithSameName;
  }
}
