import { FastifyInstance, FastifyRequest } from "fastify";
import { Utils } from "../utils/index.ts";

export const websocketController = async (server: FastifyInstance) => {
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
          // Function to fetch data
          const fetchData = async () => {
            try {
              // Replace this with your actual data retrieval logic
              const data = await Utils.getData();
              connection.socket.send(JSON.stringify(data));
            } catch (error) {
              console.error("Error fetching data:", error);
            }
          };

          // Send an initial message to the client after the connection is established
          connection.socket.send("WebSocket connection established");

          // Fetch data initially
          fetchData();

          // Set up interval to fetch and send data every second
          let timer = setInterval(fetchData, 1000);

          // Handle WebSocket connection closing
          connection.socket.on("close", () => {
            clearInterval(timer);
          });
        }
      );
    },
  });
};
