import express from "express";
import fs from "fs";
import cors from "cors";
import { getDays, getYears } from "./db/get_data";
import { updateData } from "./db/update_data";
import { insertData } from "./db/insert_data";
import { deleteData } from "./db/delete_data";
import path from "path";
import { generateExcel } from "./db/generate_excel";
import { RESULT } from "./types/types";
import cookieParser from "cookie-parser";
import { generateToken, verifyToken, verifyUser } from "./auth/auth";

const app = express();
const host = "localhost";
const port = process.env.PORT || 9081;

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
// Добавляем парсер Cookies
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/get_years", verifyToken, async (req, res) => {
  const years = await getYears();

  res.json(years);
});

app.get("/get_days/:year", verifyToken, async (req, res) => {
  const year = parseInt(req.params.year);

  const days = await getDays(year);

  res.json(days);
});

app.post("/update_day", verifyToken, (req, res) => {
  const day = req.body.data;

  updateData(day);

  res.sendStatus(200);
});

app.post("/insert_day", verifyToken, (req, res) => {
  const day = req.body.data;

  insertData(day);

  res.sendStatus(200);
});

app.post("/delete_day", verifyToken, (req, res) => {
  const date = req.body.data;

  deleteData(date);

  res.sendStatus(200);
});

app.get("/gen_excel", verifyToken, async (req, res) => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  generateExcel()
    .then((result) => res.json(result))
    .catch(() => res.json(RESULT.error));
});

app.get("/get_excel", verifyToken, (req, res) => {
  const filePath = path.join(
    __dirname,
    "../data/Выработка и потребление электроэнергии.xlsx"
  );

  res.download(filePath);
});

// Пытаемся залогинить пользователя
app.post("/login", async (req, res) => {
  const { login, password } = req.body;

  if (login === "admin" && password === "12345") {
    const user = {
      id: 100,
      login: "admin",
      firstname: "Администратор",
      lastname: "Системы",
      role: "administrator",
    };

    if (user) {
      const token = await generateToken(user.id);

      res.cookie("token", token, {
        secure: false,
        sameSite: "lax",
        httpOnly: false,
      });
    }

    res.json(user);
  } else {
    res.json({});
  }
});

// Пытаемся разлогинить пользователя
app.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json(true);
});

// Достаем пользователя если он есть
app.get("/get_user", verifyUser, async (req, res) => {
  console.log("GET_USER");

  try {
    const { id } = (req as any).user;

    if (id) {
      // const user = await database.getUser(id);

      const user = {
        id: 100,
        login: "admin",
        firstname: "Администратор",
        lastname: "Системы",
        role: "administrator",
      };

      res.json(user);
    } else {
      res.json(null);
    }
  } catch (err) {
    console.log(err);
    res.json(null);
  }
});

app.listen(parseInt("" + port), host, function () {
  console.log(
    `Gen Electricity Server listens http://${host}:${port} :: ${new Date()}`
  );
});
