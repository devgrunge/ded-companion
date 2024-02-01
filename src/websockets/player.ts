import { SocketStream } from "@fastify/websocket";
import { FastifyInstance, FastifyRequest } from "fastify";

export const websocketControler = (server: FastifyInstance) => {
  server.get("/hello", (request: FastifyRequest, reply) => {
    reply.send({
      message: "Hello Fastify",
    });
  });

  server.get("/hello-ws", { websocket: true }, (connection, req) => {
    connection.socket.on("message", (message) => {
      connection.socket.send("Hello Fastify WebSockets");
    });
  });
};
