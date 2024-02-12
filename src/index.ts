import { closeDatabaseConnection, connectToDatabase } from "./config/db.ts";
import { server } from "./server/server.ts";

server.listen({ port: 3338 }, async (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  try {
    await connectToDatabase();
    console.log(`Server listening at ${address}`);
  } catch (error) {
    console.error("Error starting server:", error);
    await closeDatabaseConnection();

    process.exit(1);
  }
});
