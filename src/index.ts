import express from "express";
import fs from "fs";
import cors from "cors";
import { getDays, getYears } from "./db/get_data";
import { updateData } from "./db/update_data";
import { checkHasDayByDate, insertData } from "./db/insert_data";
import { deleteData } from "./db/delete_data";
import path from "path";
import { generateExcel } from "./db/generate_excel";
import { IUser, RESULT } from "./types/types";
import cookieParser from "cookie-parser";
import { generateToken, verifyToken, verifyUser } from "./auth/auth";
import { getUser, getUserById } from "./db/get_user";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    credentials: true,
    origin: ["http://10.1.15.244", "http://localhost:3000"],
  })
);
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

  updateData(day)
    .then(() => res.send(""))
    .catch((error) => res.send(error));
});

app.post("/insert_day", verifyToken, (req, res) => {
  const day = req.body.data;

  checkHasDayByDate(day)
    .then(() => insertData(day))
    .then(() => res.send(""))
    .catch((error) => res.send(error));
});

app.post("/delete_day", verifyToken, (req, res) => {
  const date = req.body.data;

  deleteData(date);

  res.sendStatus(200);
});

app.post("/gen_excel", verifyToken, async (req, res) => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const data = req.body.data;

  generateExcel(data)
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

  await getUser(login, password)
    .then(async (user: IUser) => {
      if (user) {
        const token = await generateToken(user.id);

        res.cookie("token", token, {
          secure: false,
          sameSite: "lax",
          httpOnly: false,
        });
      }

      res.json(user);
    })
    .catch(() => res.json({}));
});

// Пытаемся разлогинить пользователя
app.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json(true);
});

// Достаем пользователя если он есть
app.get("/get_user", verifyUser, async (req, res) => {
  try {
    const { id } = (req as any).user;

    if (!id) throw new Error("Нету ID!");

    await getUserById(id)
      .then(async (user: IUser) => {
        res.json(user);
      })
      .catch(() => res.json(null));
  } catch (err) {
    console.log(err);
    res.json(null);
  }
});

app.listen(parseInt("" + port), function () {
  console.log(`Gen Electricity Server listens on ${port} :: ${new Date()}`);
});
