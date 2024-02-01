import Jwt, { JwtHeader } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { FastifyReply, FastifyRequest } from "fastify";
import { VerifiedUser } from "./authTypes.ts";
import { LoginModel } from "../models/loginModel.ts";
import "dotenv/config";

const database = new LoginModel();
const appSecret = process.env.PRIVATE_KEY as string;

export const jwtAuth = async (
  email: string,
  password: string
): Promise<string> => {
  try {
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
    const verifiedUser: VerifiedUser | unknown = Jwt.verify(
      token,
      appSecret
    ) as JwtHeader;

    if (!token) {
      reply.status(401).send("Unauthorized: missing token");
    }
    if (!verifiedUser) {
      throw "User not found";
    }
    if (verifiedUser && typeof verifiedUser === "object") {
      request.headers["user-id"] = (verifiedUser as VerifiedUser).id;
      request.headers["user-email"] = (verifiedUser as VerifiedUser).email;
      done();
    }
  } catch (error) {
    console.error("Could not validate user: ", error);
    return reply.status(400).send("Could not validate user");
  }
};
