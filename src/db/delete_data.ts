import { IDay } from "../types/types";
import sql from "mssql";
import QUERIES from "./queries";

export const deleteData = async (date: string) => {
  try {
    await sql.connect(process.env.SQL_STRING);

    await sql.query(QUERIES.deleteDay(date));
  } catch (err) {
    console.log(err);
  }
};
