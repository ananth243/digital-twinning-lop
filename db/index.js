import { config } from "dotenv";
import pg from "pg";

config();

const client = new pg.Client({
  database: process.env.DBNAME,
  user: process.env.DBUSER,
  password: process.env.DBPWD,
});

export default client;
