import { mongoClient } from "../config/db.ts";
import { RoomsModel } from "../models/types/modelTypes.ts";
import { PlayerParams } from "../routes/types/routeTypes.ts";

export class Utils {
  async getUserNames(roomId: string | undefined | unknown) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    const room = await roomsCollection.findOne({ room_id: roomId });

    if (!room) {
      throw new Error("Room not found");
    }

    const playerNames: PlayerParams = room.players.map((item) => {
      item.name;
    });
    // const nameArrays = new Array(playerNames);
    return playerNames;
  }
  async validatePlayerNamesInRoom(
    roomId: string | unknown,
    playerNames: unknown | undefined
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
