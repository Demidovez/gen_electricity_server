import express from "express";
import fs from "fs";
import years from "./db/years.json";
import days from "./db/days.json";
import cors from "cors";

const app = express();
const host = "localhost";
const port = process.env.PORT || 9081;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/get_years", (req, res) => {
  res.json(years);
});

app.get("/get_days", (req, res) => {
  res.json(days);
});

app.post("/update_day", (req, res) => {
  const day = req.body;

  console.log(day);

  res.sendStatus(200);
});

app.listen(parseInt("" + port), host, function () {
  console.log(
    `Gen Electricity Server listens http://${host}:${port} :: ${new Date()}`
  );
});
