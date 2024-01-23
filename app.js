import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { config } from "dotenv";
import client from "./db/index.js";

config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (_, res) => res.json({ msg: "Ping successful" }));

app.use((err, _, res, __) => {
  return res.status(err.status || 500).json({ error: err.message });
});

app.listen(PORT, async () => {
  console.log(`Server listening to port: ${PORT}`);
  await client.connect();
  console.log("Connected to DB");
});
