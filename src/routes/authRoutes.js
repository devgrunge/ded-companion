import { LoginModel } from "../models/loginModel.js";
import { authService } from "../services/auth.js";
import bcrypt from "bcrypt";

const database = new LoginModel();

export async function authRoutes(server) {
  server.post("/register", async (request, reply) => {
    try {
      const { email, password, name } = request.body;

      if (!email || !password || !name) {
        return reply
          .status(400)
          .send("Email and password and name are required");
      }

      const userExists = await database.getUserInfo(email);

      if (userExists.length > 0) {
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

      const checkAuth = await authService(email, password);

      checkAuth ? reply.status(200).send({ message: checkAuth }) : false;
    } catch (error) {
      console.error("Error logging into app: ", error);
      return reply.status(400).send("Error logging");
    }
  });
}
