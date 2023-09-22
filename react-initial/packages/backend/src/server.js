import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import routes from "./routes/index.js";

const app = express();

const SERVER_PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
const DB_URL = process.env.DB_URL;

app.use(cors());
app.use(express.json({ type: () => true }));

app.use("/api", routes);

console.log(DB_URL);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Connected to DB at ${DB_URL}`);
  })
  .then(app.listen(SERVER_PORT))
  .then(() => {
    console.log(`Server listening on port ${SERVER_PORT}`);
  });
