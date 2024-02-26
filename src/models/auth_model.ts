import { randomUUID } from "node:crypto";
import { mongoClient } from "../config/db.js";
import { PlayerParams } from "../routes/types/routeTypes.js";
import bcrypt from "bcrypt";

export class AuthModel {
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
  async deleteUser(userId: unknown) {
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

  async updateUser(
    email: string,
    password: string,
    name: string,
    isDm: boolean | undefined
  ) {
    const db = mongoClient.db("dndcompanion");
    const collection = db.collection("Players");

    try {
      const filter = { email };
      const hashedPassword = await bcrypt.hash(password, 10);
      const updateData = {
        $set: { password: hashedPassword, name, isDm },
      };

      const result = await collection.updateOne(filter, updateData);

      if (result.modifiedCount === 1) {
        return "User updated successfully";
      } else {
        return "User not updated";
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}
