import { randomUUID } from "node:crypto";
import { mongoClient } from "../config/db.js";
import { PlayerParams } from "../routes/types/routeTypes.js";

export class LoginModel {
  async createAccount({ email, password, name }: PlayerParams) {
    const dataId = randomUUID();
    const db = mongoClient.db("dndcompanion");
    const collection = db.collection("Players");

    const user = {
      id: dataId,
      name: name,
      email: email,
      password: password,
      characters: [],
      isDm: false,
      theme: "default",
    };

    try {
      const result = await collection.insertOne(user);

      if (result && result.insertedId) {
        return user;
      } else {
        throw new Error("User creation failed");
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserInfo(email: string) {
    const db = mongoClient.db("dndcompanion");
    const collection = db.collection("Players");

    try {
      const user = await collection.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }
  async deleteUser(userId: string) {
    const db = mongoClient.db("dndcompanion");
    const collection = db.collection("Players");

    try {
      const result = await collection.deleteOne({ id: userId });

      if (result && result.deletedCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
}
