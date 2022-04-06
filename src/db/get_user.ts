import sql from "mssql";
import { IUser } from "../types/types";
import QUERIES from "./queries";

export const getUser = async (
  login: string,
  password: string
): Promise<IUser | null> => {
  try {
    await sql.connect(process.env.SQL_STRING);

    const result = await sql.query(QUERIES.getUser(login, password));

    const user: IUser = result.recordset[0];

    if (user) {
      return {
        id: user.id,
        login: user.login,
        firstname: user.firstname,
        lastname: user.lastname,
        secondname: user.secondname,
        role: "",
      };
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);

    return null;
  }
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    await sql.connect(process.env.SQL_STRING);

    const result = await sql.query(QUERIES.getUserByID(id));

    const user: IUser = result.recordset[0];

    if (user) {
      return {
        id: user.id,
        login: user.login,
        firstname: user.firstname,
        lastname: user.lastname,
        secondname: user.secondname,
        role: "",
      };
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);

    return null;
  }
};
