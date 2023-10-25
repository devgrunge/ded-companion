import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "./authTypes.ts";
import { LoginModel } from "../models/loginModel.ts";
import "dotenv/config";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}

const database = new LoginModel();
const appSecret = process.env.PRIVATE_KEY as any;

export const jwtAuth = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    console.log(email, password);
    const userExists = await database.getUserInfo(email);

    if (userExists?.length === 0) {
      throw "User not found";
    }
    const storedPassword = userExists?.password;

    const isSamePassword = bcrypt.compareSync(password, storedPassword);

    if (!isSamePassword) {
      throw "Wrong password";
    }

    const userId = userExists?.id;
    const token = Jwt.sign({ id: userId, email: email }, appSecret, {
      expiresIn: "365d",
    });

    return token;
  } catch (error) {
    console.error("Error authenticating", error);
    throw error;
  }
};

export const validateToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
  done: (err?: Error) => void
) => {
  try {
    const token = request.headers.authorization
      ?.replace(/^Bearer/, "")
      .trim() as any;
    const verifiedUser: User | unknown = Jwt.verify(
      token,
      appSecret
    ) as unknown;

    if (!token) {
      reply.status(401).send("Unauthorized: missing token");
    }
    if (!verifiedUser) {
      throw "User not found";
    }
    if (verifiedUser && typeof verifiedUser === "object") {
      request.user = verifiedUser as User;
      done();
    }
  } catch (error) {
    console.error("Could not validate user: ", error);
    return reply.status(400).send("Could not validate user");
  }
};
