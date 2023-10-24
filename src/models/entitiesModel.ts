import { randomUUID } from "node:crypto";
import { nanoid } from "nanoid";
import { mongoClient } from "../config/db.js";
import { LoginModel } from "./loginModel.js";

const database = new LoginModel();

export class EntityModel {
  async list(ownerEmail) {
    const db = mongoClient.db("dndcompanion");
    const collection = db.collection("Players");

    try {
      const player = await collection.findOne({ email: ownerEmail });

      if (player && player.characters) {
        return player.characters;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  }

  async create(email, characterData) {
    try {
      const player = await database.getUserInfo(email);

      if (!player) {
        throw new Error("Player not found");
      }

      if (!player.characters) {
        player.characters = [];
      }

      player.characters.push(characterData);

      const db = mongoClient.db("dndcompanion");
      const collection = db.collection("Players");

      const filter = { email: email };
      const update = { $set: { characters: player.characters } };

      const result = await collection.updateOne(filter, update);

      if (result.modifiedCount === 1) {
        return player;
      } else {
        throw new Error("Failed to update the player's document");
      }
    } catch (error) {
      console.error("Error creating character:", error);
      throw error;
    }
  }

  async update(id, dataRequest) {
    try {
      const db = MongoClient.db("dndcompanion");
      const collection = db.collection("Players");

      const currentUserEmail = dataRequest.owner; // Get the owner's email from the request data

      // Use the email to find the player document
      const player = await collection.findOne({ email: currentUserEmail });

      if (player && player.characters) {
        const updatedCharacters = player.characters.map((character) => {
          if (character.id === id) {
            return {
              id,
              name: dataRequest.name,
              level: dataRequest.level,
              class: dataRequest.class,
              attributes: {
                for: dataRequest.attributes.for,
                dex: dataRequest.attributes.dex,
                con: dataRequest.attributes.con,
                int: dataRequest.attributes.int,
                wis: dataRequest.attributes.wis,
                car: dataRequest.attributes.car,
              },
              hitpoints: dataRequest.hitpoints,
              armor_class: dataRequest.armor_class,
            };
          }
          return character; // Return unchanged characters
        });

        // Update the characters array in the player document
        await collection.updateOne(
          { email: currentUserEmail },
          { $set: { characters: updatedCharacters } }
        );

        return true; // Update successful
      } else {
        return false; // Character not found or unauthorized
      }
    } catch (error) {
      throw error; // Handle the error appropriately in your route
    }
  }

  async delete(id, ownerEmail) {
    try {
      const db = mongoClient.db("dndcompanion");
      const collection = db.collection("Players");

      const player = await collection.findOne({ email: ownerEmail });

      if (player && player.characters) {
        const updatedCharacters = player.characters.filter(
          (character) => character.id !== id
        );

        await collection.updateOne(
          { email: ownerEmail },
          { $set: { characters: updatedCharacters } }
        );

        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  async retrievePlayerData(playerId) {
    const db = mongoClient.db("dndcompanion");
    const playersCollection = db.collection("Players");

    try {
      const player = await playersCollection.findOne({ id: playerId });
      console.log("the player",player)
      return player;
    } catch (error) {
      throw error;
    }
  }

  async fetchCharacterData(playerId, characterId) {
    const db = mongoClient.db("dndcompanion");
    const playersCollection = db.collection("Players");

    try {
      const player = await playersCollection.findOne({ id: playerId });

      if (!player || !player.characters) {
        return null;
      }

      const character = player.characters.find(
        (char) => char.id === characterId
      );

      return character;
    } catch (error) {
      throw error;
    }
  }
}
