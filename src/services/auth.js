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

    return token;
  } catch (error) {
    console.error("Error authenticating", error);
    throw error;
  }
};

export const validateToken = async (request, reply, done) => {
  try {
    const token = request.headers.authorization?.replace(/^Bearer/, "").trim();
    const verifiedUser = Jwt.verify(token, appSecret);

    if (!token) {
      reply.status(401).send("Unauthorized: missing token");
    }
    if (!verifiedUser) {
      throw "User not found";
    }
    request.user = verifiedUser;
    done();
  } catch (error) {
    console.error("Could not validate user: ", error);
    return reply.status(400).send("Could not validate user");
  }
};
