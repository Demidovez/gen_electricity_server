import { IDay } from "../types/types";
import sql from "mssql";
import QUERIES from "./queries";

export const checkHasDayByDate = (day: IDay): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      await sql.connect(process.env.SQL_STRING);

      const result = await sql.query(QUERIES.checkDayByDate(day.date));

      if (result.recordset.length > 0) {
        reject("Запись с такой датой уже есть!");
      } else {
        resolve("");
      }
    } catch (err) {
      console.log(err);
      reject("Ошибка");
    }
  });
};

export const insertData = async (day: IDay) => {
  try {
    await sql.connect(process.env.SQL_STRING);

    await sql.query(QUERIES.insertDay(day));
  } catch (err) {
    console.log(err);
  }
};
