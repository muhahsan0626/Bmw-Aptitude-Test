import cors from 'cors';
import { config } from "dotenv";
import 'dotenv/config';
import express from "express";
import { connectDatabase } from "./config/database.js";
import car_routes from "./routes/car_routes.js";

connectDatabase();

const app = express();

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/", car_routes);

app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
