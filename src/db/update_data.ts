import { IDay } from "../types/types";
import sql from "mssql";
import QUERIES from "./queries";

export const updateData = async (day: IDay) => {
  try {
    await sql.connect(process.env.SQL_STRING);

    await sql.query(QUERIES.updateDay(day));
  } catch (err) {
    console.log(err);
  }
};
