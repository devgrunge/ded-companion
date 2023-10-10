import { sql } from "../config/db.js";
import { randomUUID } from "node:crypto";

export class LoginModel {
  async createAccount(email, password, name) {
    const dataId = randomUUID();

    const login =
      await sql`INSERT INTO users (id, name, email, password) VALUES (${dataId}, ${name}, ${email}, ${password})`;
    return login;
  }

  async getUserInfo(email) {
    try {
      const findUser = await sql`select * from users where email = ${email}`;
      console.log(findUser);
      return findUser;
    } catch (error) {
      throw error;
    }
  }
}
