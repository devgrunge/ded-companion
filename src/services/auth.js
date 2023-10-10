import { LoginModel } from "../models/loginModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import "dotenv/config";

const database = new LoginModel();
const appSecret = process.env.PRIVATE_KEY;

export const authService = async (email, password) => {
  try {
    const userExists = await database.getUserInfo(email);

    if (userExists.length === 0) {
      throw "User not found";
    }
    const storedPassword = userExists[0].password;

    const isSamePassword = bcrypt.compareSync(password, storedPassword);

    if (!isSamePassword) {
      throw "Wrong password";
    }

    const userId = userExists[0].id;
    const token = Jwt.sign({ id: userId, email: email }, appSecret, {
      expiresIn: "365d",
    });

    console.log("my token", token);

    return token;
  } catch (error) {
    console.error("Error authenticating", error);
    throw error;
  }
};

export class tokenVerification {
  validateToken(server) {
    server.addHook("preHandler", async (request, reply, done) => {
      const token = request.headers.authorization?.replace(/^Bearer/, "");

      if (!token) {
        reply.status(401).send("Unauthorized: missing token");
      }
      const decodedToken = Jwt.verify(token, appSecret);
      const user = await database.getUserInfo(decodedToken.email);
      if (!user) {
        throw "User not found";
      }
      return user;
    });
  }
}
