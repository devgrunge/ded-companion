import { mongoClient } from "../config/db.js";
import { DmParams } from "../routes/types/routeTypes.js";

export class DmModel {
  async enterRoom(dataRequest: DmParams) {
    try {
      const db = mongoClient.db("dndcompanion");
      const roomsCollection = db.collection("Rooms");

      const room = await roomsCollection.findOne({
        room_id: dataRequest.room_id,
      });

      if (!room) {
        throw new Error("Room not found");
      }

      const existingDm = room.players.find((player: any) => player.isDm);

      if (existingDm) {
        throw new Error("A Dungeon Master already exists in this room.");
      }

      const newDm = {
        isDm: true,
        name: dataRequest.name,
      };

      room.players.push(newDm);

      await roomsCollection.updateOne({ _id: room._id }, { $set: room });
    } catch (error) {
      throw new Error("Internal server error: " + error);
    }
  }
}
