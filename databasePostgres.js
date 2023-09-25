import { sql } from "./db.js";
import { randomUUID } from "node:crypto";

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

  async create(character) {
    const characterId = randomUUID();
    const data = character;
    console.log("data character ==>", data);
    await sql`insert into characters (id, name, level , class, attributes , armor_class, hitpoints ) VALUES (${characterId},${
      data.name
    }, ${data.level}, ${data.class}, ${sql.json(data.attributes)}, ${
      data.armor_class
    }, ${data.hitpoints})`;
  }

  async update(id, character) {
    console.log("my id ==>", id);
    const data = character;

    await sql`update characters set name = ${data.name}, class = ${data.class}, level = ${data.level} WHERE id = ${id}`;
  }

  async delete(id) {
    await sql`delete from characters where id = ${id}`;
  }
}
