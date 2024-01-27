import { server } from "./server/server.ts";

// listen http server
server.listen({ port: 3338 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  // listen to websocket server
  server.ready((err) => {
    if (err) throw err;

    server.io.on("connection", (socket: any) =>
      console.info("Socket connected!", socket.id)
    );
  });

  console.log(`Server listening at ${address}`);
});
