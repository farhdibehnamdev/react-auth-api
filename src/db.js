import { MongoClient } from "mongodb";

let client;

export const initializeDbConnection = async () => {
  client = await MongoClient.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export const getDbConnection = (dbName) => {
  const db = client.db(dbName);
  return db;
};
