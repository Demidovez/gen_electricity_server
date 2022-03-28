import sql from "mssql";
import { IDay, IYear, RESULT } from "../types/types";
import QUERIES from "./queries";
import xl from "excel4node";
import path from "path";

export const generateExcel = async (): Promise<RESULT> => {
  try {
    await sql.connect(process.env.SQL_STRING);

    const resultDays = await sql.query(QUERIES.getDaysSinceYear(2020));

    const days: IDay[] = resultDays.recordset;

    const wb = new xl.Workbook({
      defaultFont: {
        size: 11,
        name: "Times New Roman",
        color: "000000",
      },
    });

    const ws = wb.addWorksheet("Данные");

    const styleTitle = wb.createStyle({
      font: {
        size: 14,
        bold: true,
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    });

    const stylePlusMinus = wb.createStyle({
      font: {
        size: 12,
        bold: false,
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    });

    const styleCell = wb.createStyle({
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrapText: true,
      },
      border: {
        left: {
          style: "thin",
          color: "000000",
        },
        top: {
          style: "thin",
          color: "000000",
        },
        right: {
          style: "thin",
          color: "000000",
        },
        bottom: {
          style: "thin",
          color: "000000",
        },
      },
    });

    ws.column(1).setWidth(20);
    ws.column(2).setWidth(20);
    ws.column(3).setWidth(20);
    ws.column(4).setWidth(20);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(20);
    ws.column(7).setWidth(20);
    ws.column(8).setWidth(20);
    ws.column(9).setWidth(20);
    ws.column(10).setWidth(20);

    ws.row(1).setHeight(25);
    ws.row(2).setHeight(25);
    ws.row(3).setHeight(25);
    ws.row(4).setHeight(30);

    ws.cell(1, 1, 1, 9, true)
      .string('ОАО "Светлогорский ЦКК"')
      .style(styleTitle);
    ws.cell(1, 10, 1, 11, true)
      .string('"+" утро > вечера')
      .style(stylePlusMinus);

    ws.cell(2, 1, 2, 9, true)
      .string(
        "Выработка / потребление  электроэнергии (тыс. кВтч) и потребление теплоэнергии (Гкал)"
      )
      .style(styleTitle);

    ws.cell(2, 10, 2, 11, true)
      .string('"-" утро < вечера')
      .style(stylePlusMinus);

    ws.cell(3, 1, 4, 1, true).string("Дата/Месяц/Год").style(styleCell);
    ws.cell(3, 2, 4, 2, true)
      .string("Выработка целлюлозы, тонн.")
      .style(styleCell);
    ws.cell(3, 3, 3, 4, true).string("Прямое потребление").style(styleCell);
    ws.cell(4, 3).string("Всего, тыс. кВтч").style(styleCell);
    ws.cell(4, 4).string("в том числе ЗБЦ, тыс. кВтч").style(styleCell);
    ws.cell(3, 5, 4, 5, true)
      .string("Выработка электроэнергии, тыс. кВтч")
      .style(styleCell);
    ws.cell(3, 6, 4, 6, true)
      .string("% от общего потребления")
      .style(styleCell);
    ws.cell(3, 7, 4, 7, true).string("Продано, тыс. кВтч").style(styleCell);
    ws.cell(3, 8, 3, 11, true)
      .string('Потреблено от РУП "Гомельэнерго"')
      .style(styleCell);
    ws.cell(4, 8).string("тыс. кВтч").style(styleCell);
    ws.cell(4, 9, 4, 10, true).string("Мощность, МВт").style(styleCell);
    ws.cell(4, 11).string("Гкал").style(styleCell);

    for (let i = 0; i < days.length; i++) {
      ws.cell(5 + i, 1)
        .string(`c 1 по ${new Date(days[i].date).getDate()}`)
        .style(styleCell);
      ws.cell(5 + i, 2)
        .number(days[i].production)
        .style(styleCell);
      ws.cell(5 + i, 3)
        .number(days[i].total_consumed)
        .style(styleCell);
      ws.cell(5 + i, 4)
        .number(days[i].ZBC_consumed)
        .style(styleCell);
      ws.cell(5 + i, 5)
        .number(days[i].generation)
        .style(styleCell);
      ws.cell(5 + i, 6)
        .number(days[i].procentage)
        .style(styleCell);
      ws.cell(5 + i, 7)
        .number(days[i].sold)
        .style(styleCell);
      ws.cell(5 + i, 8)
        .number(days[i].RUP_consumed)
        .style(styleCell);
      ws.cell(5 + i, 9)
        .number(days[i].power)
        .style(styleCell);
      ws.cell(5 + i, 10)
        .string(days[i].plus ? "" : "+")
        .style(styleCell);
      ws.cell(5 + i, 11)
        .number(days[i].gkal)
        .style(styleCell);
    }

    const filePath = path.join(
      __dirname,
      "../../data/Выработка и потребление электроэнергии.xlsx"
    );

    wb.write(filePath);

    return RESULT.ok;
  } catch (err) {
    console.log(err);
    return RESULT.error;
  }
};
