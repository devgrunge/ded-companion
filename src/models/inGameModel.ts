import { mongoClient } from "../config/db.js";
import { RoomData } from "../routes/types/routeTypes.js";
import { CharacterModel } from "./characterModel.js";
import { DmModel } from "../models/dmModel.ts"

const characterDatabase = new CharacterModel();
const dmDatabase = new DmModel()

export class InGameModel {
  async create(dataRequest: RoomData) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const result = await roomsCollection.insertOne(dataRequest);

      // todo: see if this method returns a correct data
      console.log("result",result)
      return result.acknowledged;
    } catch (error) {
      throw error;
    }
  }

  async setDungeonMaster(playerId: string) {
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

  async getRoomByInviteCode(inviteCode: string) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const room = await roomsCollection.findOne({ inviteCode: inviteCode });

      return room;
    } catch (error) {
      throw error;
    }
  }

  async updateRoom(roomId: string, updatedData: object) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const result = await roomsCollection.findOneAndUpdate(
        { room_id: roomId },
        { $set: updatedData },
        { returnDocument: "after" }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteRoom(roomId: string) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const result = await roomsCollection.deleteOne({ room_id: roomId });

      return result;
    } catch (error) {
      throw error;
    }
  }
  async roomExists(roomId: string) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const room = await roomsCollection.findOne({ room_id: roomId });
      return room !== null;
    } catch (error) {
      throw error;
    }
  }

  async characterBelongsToPlayer(
    playerId: string | undefined,
    characterId: string | undefined
  ) {
    const db = mongoClient.db("dndcompanion");
    const playersCollection = db.collection("Players");

    try {
      const player = await playersCollection.findOne({ id: playerId });

      if (!player || !player.characters) {
        return false;
      }

      const character = player.characters.find(
        (char: any) => char.id === characterId
      );
      return character !== undefined;
    } catch (error) {
      throw error;
    }
  }

  async enterRoom(
    playerId: string | undefined,
    roomId: string | undefined,
    characterId: string | undefined
  ) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      const character = await characterDatabase.fetchCharacterData(
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
        (player: any) => player.id === playerId
      );

      if (existingPlayerIndex !== -1) {
        room.players[existingPlayerIndex].character = character;
      } else {
        room.players.push({
          id: playerId,
          character: character,
        });
      }

      const updatedRoom = await roomsCollection.findOneAndUpdate(
        { room_id: roomId },
        { $set: { players: room.players } },
        { returnDocument: "after" }
      );

      return updatedRoom?.value;
    } catch (error) {
      throw error;
    }
  }

  async leaveRoom(roomId: string, characterId: string) {
    const db = mongoClient.db("dndcompanion");
    const roomsCollection = db.collection("Rooms");

    try {
      if (!roomId || !characterId) {
        throw new Error("Invalid roomId or characterId");
      }

      const existingRoom = await roomsCollection.findOne({ room_id: roomId });

      if (!existingRoom) {
        throw new Error("Room not found");
      }

      console.log(
        "Document to update:",
        await roomsCollection.findOne({ room_id: roomId })
      );
      const removePlayer = await roomsCollection.updateOne(
        { room_id: roomId, "players.character.id": characterId },
        { $pull: { players: { "character.id": characterId } } }
      );

      if (removePlayer.modifiedCount === 0) {
        throw new Error("Player not found");
      }

      return removePlayer;
    } catch (error) {
      throw error;
    }
  }

  async getPlayersInRoom(roomId: string) {}

  async getDungeonMastersInRoom(roomId: string) {}
}
