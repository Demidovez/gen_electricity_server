import express from "express";
import fs from "fs";
import cors from "cors";
import { getDays, getYears } from "./db/get_data";
import { updateData } from "./db/update_data";
import { insertData } from "./db/insert_data";

const app = express();
const host = "localhost";
const port = process.env.PORT || 9081;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/get_years", async (req, res) => {
  const years = await getYears();

  res.json(years);
});

app.get("/get_days/:year", async (req, res) => {
  const year = parseInt(req.params.year);

  const days = await getDays(year);

  res.json(days);
});

app.post("/update_day", (req, res) => {
  const day = req.body.data;

  updateData(day);

  res.sendStatus(200);
});

app.post("/insert_day", (req, res) => {
  const day = req.body.data;

  insertData(day);

  res.sendStatus(200);
});

app.listen(parseInt("" + port), host, function () {
  console.log(
    `Gen Electricity Server listens http://${host}:${port} :: ${new Date()}`
  );
});
