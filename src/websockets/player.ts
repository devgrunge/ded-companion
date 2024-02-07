import { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";
import { Utils } from "../utils";

export const websocketController = async (server: FastifyInstance) => {
  server.get("/hello", (request, reply) => {
    reply.send({
      message: "Hello Fastify",
    });
  });
  server.route<{
    Querystring: { token?: string };
  }>({
    method: "GET",
    url: "/socket",
    handler: async (request, reply) => {
      // Establish WebSocket connection
      reply.websocket(
        { maxPayload: 1048576 }, // You can customize options here
        async (connection, req) => {
          console.log("WebSocket connection initiated");
          // Listen for incoming messages
          connection.socket.on("message", (message) => {
            console.log("WebSocket message received:", message);
            // Respond to the client with the same message
            connection.socket.send(message);
          });
          // Handle WebSocket connection closing
          connection.socket.on("close", () => {
            console.log("WebSocket connection closed");
          });
          // Send an initial message to the client after the connection is established
          connection.socket.send("WebSocket connection established");
        }
      );
    },
  });
  server.route<{
    Querystring: { token?: string };
  }>({
    method: "GET",
    url: "/letters",
    handler: async (request, reply) => {
      // Use the websocket decorator for WebSocket routes
      reply.websocket(
        { maxPayload: 1048576 }, // You can customize options here
        async (connection, req) => {
          let timer = setInterval(() => {
            connection.socket.send(Utils.randomLetter());
          }, 1000);
          // Handle WebSocket connection closing
          connection.socket.on("close", () => {
            clearInterval(timer);
          });
        }
      );
    },
  });
};
