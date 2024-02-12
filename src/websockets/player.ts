import { FastifyInstance, FastifyRequest } from "fastify";

export const websocketController = (server: FastifyInstance) => {
  server.io.on("connection", (socket: any) => {
    console.info("Socket connected!", socket.id);
    socket.on("fetch_letters_data", () => {});
  });
};
