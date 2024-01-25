import { config } from "dotenv";
import pg from "pg";

config();

const getDBPool = (concurrencyCount = 25) => {
  return new pg.Pool({
      concurrencyCount: concurrencyCount,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PWD,
  })
}

export default getDBPool;
