import { FastifyInstance } from 'fastify';
import { jwtAuth, validateToken } from "../services/auth.js";
import { LoginModel } from "../models/loginModel.js";
import bcrypt from "bcrypt";

const database = new LoginModel();

export const authRoutes = async(server : FastifyInstance) => {
  server.get("/", async (request, reply) => {
    try {
      reply
        .status(200)
        .send({ message: "Welcome to dnd battle companion app" });
    } catch (error) {
      reply.status(500).send("Internal server error");
    }
  });

  server.post("/register", async (request, reply) => {
    try {
      const { email, password, name } = request.body;

      if (!email || !password || !name) {
        return reply
          .status(400)
          .send("Email and password and name are required");
      }

      const userExists = await database.getUserInfo(email);

      if (userExists !== null && userExists.length > 0) {
        return reply.status(400).send("User email already registered");
      }
      const encryptedPassword = bcrypt.hashSync(password, 10);

      await database.createAccount(email, encryptedPassword, name);

      return reply.status(201).send("Sucess creating player");
    } catch (error) {
      console.log("Error creating new user: ", error);
      return reply.status(500).send("Internal Server Error");
    }
  });

  server.post("/login", async (request, reply) => {
    try {
      const { email, password } = request.body;

      if (!email || !password) {
        return reply.status(400).send("Email and password are required");
      }

      const checkAuth = await jwtAuth(email, password);

      checkAuth ? reply.status(200).send({ message: checkAuth }) : false;
    } catch (error) {
      console.error("Error logging into app: ", error);
      return reply.status(400).send("Error logging: ", error);
    }
  });

  server.delete(
    "/users/:id",
    {
      preHandler: [validateToken],
    },
    async (request, reply) => {
      try {
        const userId = request.params.id;
        console.log("userId: ", userId);

        const success = await database.deleteUser(userId);

        if (success) {
          return reply.status(204).send("User deleted successfully");
        } else {
          return reply.status(404).send("User not found or unauthorized");
        }
      } catch (error) {
        console.error("Error deleting user: ", error);
        return reply.status(500).send("Internal Server Error");
      }
    }
  );
}
