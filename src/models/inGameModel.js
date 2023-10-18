import { mongoClient } from "../config/db.js";

export class InGameModel {
  async create(dataRequest, creatorId) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");
    const playersCollection = db.collection("Players");

    try {
      const result = await roomsCollection.insertOne(dataRequest);

      return result.ops;
    } catch (error) {
      throw error;
    }
  }

  async setDungeonMaster(playerId) {
    const db = mongoClient.db("dndcompanion");
    const playersCollection = db.collection("Players");

    try {
      await playersCollection.updateOne(
        { id: playerId },
        { $set: { isDm: true } }
      );
    } catch (error) {
      throw error;
    }
  }

  async getRoomByInviteCode(inviteCode) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const room = await roomsCollection.findOne({ inviteCode: inviteCode });

      return room;
    } catch (error) {
      throw error;
    }
  }

  async updateRoom(roomId, updatedData) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const result = await roomsCollection.findOneAndUpdate(
        { room_id: roomId },
        { $set: updatedData },
        { returnOriginal: false }
      );

      console.log("result: ", result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async enterRoomPlayerRoom(playerId, roomId) {
    // try {
    //   // Check if the player is already in the room
    //   const existingEntry =
    //     await sql`select * from players_rooms where player_id = ${playerId} and room_id = ${roomId}`;
    //   if (existingEntry.length > 0) {
    //     throw new Error("Player is already in the room.");
    //   }
    //   // Delete player from players_rooms table
    //   await sql`insert into players_rooms (player_id, room_id) VALUES (${playerId}, ${roomId})`;
    // } catch (error) {
    //   throw error;
    // }
  }

  async leaveRoom(playerId, roomId) {
    // try {
    //   await sql`delete from players_rooms where player_id = ${playerId} and room_id = ${roomId}`;
    // } catch (error) {
    //   throw error;
    // }
  }

  async getPlayersInRoom(roomId) {
    // try {
    //   const playersInRoom = await sql`
    //   SELECT
    //     characters.id,
    //     characters.name,
    //     characters.armor_class,
    //     characters.attributes,
    //     characters.class,
    //     characters.hitpoints,
    //     characters.level
    //   FROM characters
    //   JOIN players_rooms ON characters.id = players_rooms.player_id
    //   WHERE players_rooms.room_id = ${roomId}
    // `;
    //   return playersInRoom;
    // } catch (error) {
    //   throw error;
    // }
  }
}
