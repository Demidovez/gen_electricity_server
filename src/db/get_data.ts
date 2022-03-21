import sql from "mssql";
import { IDay, IYear } from "../types/types";
import QUERIES from "./queries";

export const getYears = async (): Promise<IYear[]> => {
  let years: IYear[] = [];

  try {
    await sql.connect(process.env.SQL_STRING);

    const resultYear = await sql.query(QUERIES.getYears());

    years = resultYear.recordset;
  } catch (err) {
    console.log(err);
  }

  return years;
};

export const getDays = async (year: number): Promise<IDay[]> => {
  let days: IDay[] = [];

  try {
    await sql.connect(process.env.SQL_STRING);

    const resultYear = await sql.query(QUERIES.getDays(year));

    // console.log(resultYear.recordset);

    days = resultYear.recordset;
  } catch (err) {
    console.log(err);
  }

  return days;
};
