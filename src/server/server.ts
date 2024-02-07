import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import { routesController } from "../controllers/routesController.ts";
import fastifyCors from "@fastify/cors";
import { websocketController } from "../websockets/player.ts";
import "dotenv/config";

const server = fastify();

server.register(fastifyCors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "authorization"],
  credentials: true,
});

server.register(fastifyIO, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  },
}
);


  // server.get("/hello", (request, reply) => {
  //   reply.send({
  //     message: "Hello Fastify",
  //   });
  // });
  // server.route<{
  //   Querystring: { token?: string };
  // }>({
  //   method: "GET",
  //   url: "/socket",
  //   handler: async (request, reply) => {
  //     // Establish WebSocket connection
  //     reply.websocket(
  //       { maxPayload: 1048576 }, // You can customize options here
  //       async (connection, req) => {
  //         console.log("WebSocket connection initiated");
  //         // Listen for incoming messages
  //         connection.socket.on("message", (message) => {
  //           console.log("WebSocket message received:", message);
  //           // Respond to the client with the same message
  //           connection.socket.send(message);
  //         });
  //         // Handle WebSocket connection closing
  //         connection.socket.on("close", () => {
  //           console.log("WebSocket connection closed");
  //         });
  //         // Send an initial message to the client after the connection is established
  //         connection.socket.send("WebSocket connection established");
  //       }
  //     );
  //   },
  // });
  


websocketController(server);
routesController(server);
export { server };
