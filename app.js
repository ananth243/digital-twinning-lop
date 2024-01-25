import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
import router from "./routers/sensorRouter.js";

config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "*");
  res.set("Access-Control-Allow-Methods", "*");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  next();
});

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_, res) => res.json({ msg: "Ping successful" }));

app.use("/sensor", router);

app.listen(PORT, async () => console.log(`Server listening to port: ${PORT}`));
