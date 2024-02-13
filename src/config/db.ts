import "dotenv/config";
import { MongoClient } from "mongodb";

const dbPassword = process.env.DBPASSWORD;
const uri = `mongodb+srv://admingrunge:${dbPassword}@cluster0.1vwytba.mongodb.net/`;

const mongoClient = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await mongoClient.connect();
  } catch (error) {
    throw error;
  }
}

export function closeDatabaseConnection() {
  return mongoClient.close();
}

export { mongoClient };
