import { sql } from "../config/db.js";
import { randomUUID } from "node:crypto";
import { nanoid } from "nanoid";

export class DatabasePostgres {
  async list(search, entityType) {
    let query;

    switch (entityType) {
      case "player":
        query = sql`select * from characters`;
        break;

      case "dungeon_master":
        query = sql`select * from dungeon_masters`;
        break;

      case "room":
        query = sql`select * from rooms`;
        break;

      default:
        throw new Error("Unrecognized entity type");
    }

    if (search) {
      query.append(sql` where name ilike ${"%" + search + "%"}`);
    }

    return await query;
  }

  async create(dataRequest, entityType) {
    const dataId = randomUUID();
    const data = dataRequest;

    switch (entityType) {
      case "player":
        await sql`insert into characters (id, name, level , class, attributes , armor_class, hitpoints ) VALUES (${dataId}, ${
          data.name
        }, ${data.level}, ${data.class}, ${sql.json(data.attributes)}, ${
          data.armor_class
        }, ${data.hitpoints})`;
        break;

      case "room":
        await sql`insert into rooms (id, room_name, invite_code) VALUES (${dataId}, ${
          data.room_name
        }, ${nanoid(4)})`;
        break;

      case "dungeon_master":
        await sql`insert into dungeon_master(id, dm_name) VALUES (${dataId}, ${data.dm_name})`;
        break;

      default:
        throw new Error("Unrecognized entity type");
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
