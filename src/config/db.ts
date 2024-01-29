import "dotenv/config";
import { MongoClient } from "mongodb";

const dbPassword = process.env.DBPASSWORD;
const uri = `mongodb+srv://admingrunge:${dbPassword}@cluster0.1vwytba.mongodb.net/`;

const mongoClient = new MongoClient(uri);

async function run() {
  try {
    await mongoClient.connect();
  } catch {
    await mongoClient.close();
  }
}

run().catch(console.dir);

export { mongoClient };
