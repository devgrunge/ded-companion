import { mongoClient } from "../config/db.js";
import { EntityModel } from "./entitiesModel.js";

const database = new EntityModel();

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

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteRoom(roomId) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const result = await roomsCollection.deleteOne({ room_id: roomId });

      return result;
    } catch (error) {
      throw error;
    }
  }
  async roomExists(roomId) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const room = await roomsCollection.findOne({ room_id: roomId });
      return room !== null;
    } catch (error) {
      throw error;
    }
  }

  async characterBelongsToPlayer(playerId, characterId) {
    const db = mongoClient.db("dndcompanion");
    const playersCollection = db.collection("Players");

    try {
      const player = await playersCollection.findOne({ id: playerId });

      if (!player || !player.characters) {
        return false;
      }

      const character = player.characters.find(
        (char) => char.id === characterId
      );
      return character !== undefined;
    } catch (error) {
      throw error;
    }
  }

  async enterRoom(playerId, roomId, characterId) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const character = await database.fetchCharacterData(
        playerId,
        characterId
      );

      if (!character) {
        throw new Error("Character not found.");
      }

      // Fetch the room and its players
      const room = await roomsCollection.findOne({ room_id: roomId });

      if (!room) {
        throw new Error("Room not found.");
      }

      const existingPlayerIndex = room.players.findIndex(
        (player) => player.id === playerId
      );

      if (existingPlayerIndex !== -1) {
        // Player already exists, update their character
        room.players[existingPlayerIndex].character = character;
      } else {
        // Player doesn't exist, add them to the room
        room.players.push({
          id: playerId,
          character: character,
        });
      }

      const updatedRoom = await roomsCollection.findOneAndUpdate(
        { room_id: roomId },
        { $set: { players: room.players } },
        { returnOriginal: false }
      );

  

      return updatedRoom.value;
    } catch (error) {
      throw error;
    }
  }

  async leaveRoom(roomId, characterId) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const result = await roomsCollection.findOneAndUpdate(
        { room_id: roomId },
        { $pull: { players: { character: { id: characterId } } } },
        { returnOriginal: false }
      );

      if (result.value === null) {
        throw new Error("Character not found in the room.");
      }

      return result.value;
    } catch (error) {
      throw error;
    }
  }
}
