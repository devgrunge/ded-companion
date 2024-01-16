import { Server } from "socket.io";
import { server } from "./server/server.ts";

export const io = new Server({
  /* options */
});

io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.emit("foo", "bar");

  socket.on("foobar", () => {});

  socket.join("room1");

  io.to("room1").emit("hello");

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

server.listen({ port: 3338 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
