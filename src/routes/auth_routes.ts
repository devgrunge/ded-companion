import { FastifyInstance, FastifyReply } from "fastify";
import { jwtAuth, validateToken } from "../middlewares/auth_middleware.ts";
import { AuthModel } from "../models/auth_model.ts";
import bcrypt from "bcrypt";
import {
  PlayerParams,
  RequestParams,
  RouteInterface,
} from "./types/route_types.ts";

const database = new AuthModel();

const AuthRoutes = async (server: FastifyInstance) => {
  server.get<RouteInterface>("/", async (request, reply) => {
    try {
      reply
        .status(200)
        .send({ success: "Welcome to dnd battle companion app" });
    } catch (error) {
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  server.post<RouteInterface>(
    "/register",
    async (request, reply: FastifyReply) => {
      try {
        const { email, password, name } = request.body as PlayerParams;

        const playerData: PlayerParams = { email, password, name };

        if (!email || !password || !name) {
          return reply
            .status(400)
            .send({ error: "Email and password and name are required" });
        }

        const userExists = await database.getUserInfo(email);

        if (userExists !== null) {
          return reply
            .status(400)
            .send({ error: "User email already registered" });
        }
        playerData.password = bcrypt.hashSync(password, 10);

        const player = await database.createAccount(playerData);

        return reply.status(201).send({ success: player });
      } catch (error) {
        console.log("Error creating new user: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );

  server.post<RouteInterface>(
    "/login",
    async (request, reply: FastifyReply) => {
      try {
        const { email, password } = request.body as PlayerParams;

        if (!email || !password) {
          return reply
            .status(400)
            .send({ error: "Email and password are required" });
        }

        const checkAuth = await jwtAuth(email, password);

        checkAuth ? reply.status(200).send({ message: checkAuth }) : false;
      } catch (error) {
        console.error("Error logging into app: ", error);
        return reply.status(400).send({ error: "Error logging: " });
      }
    }
  );

  server.put<RouteInterface>(
    "/users/update",
    {
      preHandler: [validateToken],
    },
    async (request, reply: FastifyReply) => {
      try {
        const { email, password, name, isDm } = request.body as PlayerParams;

        if (!email || !password || !name) {
          return reply
            .status(400)
            .send({ error: "Email and password are required" });
        }

        const userExists = await database.getUserInfo(email);

        if (!userExists) {
          return reply.status(400).send({ errror: "User do not exists" });
        }

        const updatedUser = await database.updateUser(
          email,
          password,
          name,
          isDm
        );

        return reply.status(204).send({ updated: updatedUser });
      } catch (error) {
        console.error("Error updating player data", error);
        return reply.status(400).send({ error: "Error updatind Player" });
      }
    }
  );

  server.delete<RouteInterface>(
    "/users/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const userId = (request as unknown as RequestParams).params.id;
        console.log("userId: ", userId);

        const success = await database.deleteUser(userId);

        if (success) {
          return reply
            .status(204)
            .send({ updated: "User deleted successfully" });
        } else {
          return reply
            .status(404)
            .send({ error: "User not found or unauthorized" });
        }
      } catch (error) {
        console.error("Error deleting user: ", error);
        return reply.status(500).send({ error: "Internal Server Error" });
      }
    }
  );
};

export default AuthRoutes;
