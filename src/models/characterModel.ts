import { mongoClient } from "../config/db.js";
import { LoginModel } from "./loginModel.js";
import { CharacterData } from "../routes/types/routeTypes.js";

const database = new LoginModel();

export class CharacterModel {
  async list(ownerEmail: string) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("dndcompanion");
      const collection = db.collection("Players");

      const player = await collection.findOne({ email: ownerEmail });

      if (player && player.characters) {
        return player.characters;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    } finally {
      mongoClient.close();
    }
  }

  async create(email: string, characterData: CharacterData) {
    try {
      await mongoClient.connect();
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
    } finally {
      mongoClient.close();
    }
  }

  async update(id: string, dataRequest: CharacterData) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("dndcompanion");
      const collection = db.collection("Players");

      const currentUserEmail = dataRequest.owner;

      const player = await collection.findOne({ email: currentUserEmail });

      if (player && player.characters) {
        const updatedCharacters = player.characters.map(
          (character: CharacterData) => {
            if (character.id === id) {
              return {
                id,
                name: dataRequest.name,
                level: dataRequest.level,
                class: dataRequest.class,
                attributes: {
                  str: dataRequest.attributes.str,
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
            return character;
          }
        );

        await collection.updateOne(
          { email: currentUserEmail },
          { $set: { characters: updatedCharacters } }
        );

        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    } finally {
      mongoClient.close();
    }
  }

  async delete(id: string, ownerEmail: string) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("dndcompanion");
      const collection = db.collection("Players");

      const player = await collection.findOne({ email: ownerEmail });

      if (player && player.characters) {
        const updatedCharacters = player.characters.filter(
          (character: CharacterData) => character.id !== id
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
    } finally {
      mongoClient.close();
    }
  }

  async retrievePlayerData(playerId: string) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("dndcompanion");
      const playersCollection = db.collection("Players");

      const player = await playersCollection.findOne({ id: playerId });

      return player;
    } catch (error) {
      throw error;
    } finally {
      mongoClient.close();
    }
  }

  async fetchCharacterData(
    playerId: string | undefined,
    characterId: string | undefined
  ) {
    try {
      await mongoClient.connect();
      const db = mongoClient.db("dndcompanion");
      const playersCollection = db.collection("Players");

      const player = await playersCollection.findOne({ id: playerId });

      if (!player || !player.characters) {
        return null;
      }

      const character = player.characters.find(
        (char: { id: string }) => char.id === characterId
      );

      return character;
    } catch (error) {
      throw error;
    } finally {
      mongoClient.close();
    }
  }
}
