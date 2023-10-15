import { dynamoClient } from "../config/db.js";
import { randomUUID } from "node:crypto";
import { nanoid } from "nanoid";

export class EntityModel {
  async list(entityType) {
    let TABLE_NAME;
    let query;

    switch (entityType) {
      case "player":
        TABLE_NAME = "Players";
        break;

      // ... (other cases)

      default:
        throw new Error("Unrecognized entity type");
    }

    const params = {
      TableName: TABLE_NAME,
    };

    try {
      const result = await dynamoClient.scan(params).promise();
      console.log(result);
      return result.Items;
    } catch (error) {
      console.error("Error listing characters:", error);
      throw error;
    }
  }

  async create(dataRequest, entityType) {
    const data = dataRequest;
    const playerDataString = JSON.stringify(data);
    let TABLE_NAME;
    let queryData;

    switch (entityType) {
      case "player":
        TABLE_NAME = "Players";
        queryData = {
          player_data: playerDataString,
        };
        break;

      case "room":
        TABLE_NAME = "Rooms"; // Use the actual table name
        queryData = {
          id: data.id, // Use id as the partition key
          room_name: data.room_name,
          invite_code: nanoid(4),
        };
        break;

      case "dungeon_master":
        TABLE_NAME = "Dungeon_Masters"; // Use the actual table name
        queryData = {
          id: data.id, // Use id as the partition key
          dm_name: data.dm_name,
        };
        break;

      default:
        throw new Error("Unrecognized entity type");
    }

    const params = {
      TableName: TABLE_NAME,
      Key: data.id,
      Item: queryData,
    };

    try {
      await dynamoClient.put(params).promise();
    } catch (error) {
      console.error("Error creating entity:", error);
      throw error;
    }
  }

  async update(id, dataRequest, entityType) {
    const data = dataRequest;
    let query;

    switch (entityType) {
      case "player":
        query = sql`update characters set name = ${data.name}, class = ${
          data.class
        }, level = ${data.level}, attributes = ${sql.json(
          data.attributes
        )}, armor_class = ${data.armor_class}, hitpoints = ${
          data.hitpoints
        } WHERE id = ${id}`;
        break;

      case "dungeon_master":
        query = sql`update dungeon_masters set dm_name = ${data.dm_name} WHERE id = ${id}`;
        break;

      case "room":
        query = sql`update rooms set room_name = ${data.room_name} WHERE id = ${id}`;
        break;

      default:
        throw new Error("Unrecognized entity type");
    }

    await query;
  }

  async delete(id, entityType) {
    let query;

    switch (entityType) {
      case "player":
        query = sql`delete from characters where id = ${id}`;
        break;

      case "dungeon_master":
        query = sql`delete from dungeon_masters where id = ${id}`;
        break;

      case "room":
        query = sql`delete from rooms where id = ${id}`;
        break;

      default:
        throw new Error("Unrecognized entity type");
    }

    await query;
  }
}
