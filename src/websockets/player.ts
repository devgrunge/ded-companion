import { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";

export const websocketControler = (server: FastifyInstance) => {
  server.get("/hello", (request: FastifyRequest, reply) => {
    reply.send({
      message: "Hello Fastify",
    });
  });

  server.get("/hello-ws", { websocket: true }, (connection, req) => {
    console.log("Client connected");
    connection.socket.on("message", (message) => {
      console.log(`Client message: ${message}`);
    });
    connection.socket.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
