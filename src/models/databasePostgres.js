import { sql } from "../config/db.js";
import { randomUUID } from "node:crypto";
import { nanoid } from 'nanoid'

export class DatabasePostgres {
  async list(search) {
    let characters;

    if (search) {
      characters = await sql`select * from characters where name ilike ${
        "%" + search + "%"
      }`;
    } else {
      characters = await sql`select * from characters`;
    }
    return characters;
  }

  async create(dataRequest, entityType) {
    const dataId = randomUUID();
    const data = dataRequest;
    if (entityType === "player") {
      await sql`insert into characters (id, name, level , class, attributes , armor_class, hitpoints ) VALUES (${dataId},${
        data.name
      }, ${data.level}, ${data.class}, ${sql.json(data.attributes)}, ${
        data.armor_class
      }, ${data.hitpoints})`;
    } else if (entityType === "room") {
      await sql`insert into rooms (id, room_name, invite_code) VALUES (${dataId}, ${data.room_name}, ${nanoid(4)})`;
    } else {
      throw new Error("Unrecognized entity type");
    }
  }

  async update(id, character) {
    const data = character;

    await sql`update characters set name = ${data.name}, class = ${
      data.class
    }, level = ${data.level}, attributes = ${sql.json(
      data.attributes
    )}, armor_class = ${data.armor_class}, hitpoints = ${
      data.hitpoints
    }  WHERE id = ${id}`;
  }

  async delete(id) {
    await sql`delete from characters where id = ${id}`;
  }
}
