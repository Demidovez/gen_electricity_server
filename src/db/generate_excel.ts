import sql from "mssql";
import { IDay, IKvartal, IMonth, IYear, MONTHS, RESULT } from "../types/types";
import QUERIES from "./queries";
import xl from "excel4node";
import path from "path";
import { getKvartalNumber } from "../helpers/helpers";

export const generateExcel = async (
  expandedRows: string[]
): Promise<RESULT> => {
  let months: IMonth[] = [];
  let kvartals: IKvartal[] = [];
  let years: IYear[] = [];

  try {
    await sql.connect(process.env.SQL_STRING);

    const resultDays = await sql.query(QUERIES.getAllDays());

    const days: IDay[] = resultDays.recordset;

    // Определяем месяца
    days.forEach((day) => {
      const year = new Date(day.date).getFullYear();
      const month = new Date(day.date).getMonth() + 1;
      const kvartal = getKvartalNumber(month);

      const monthIndex = months.findIndex(
        (item) => item.month === month && item.year === year
      );

      const isExpanded =
        expandedRows.includes(
          `year_${year}.kvartal_${kvartal}.month_${month}`
        ) || expandedRows.length === 0;

      // Если месяц уже есть до добавляем к нему данные за день
      if (monthIndex > -1) {
        const monthFound = months[monthIndex];

        months[monthIndex] = {
          ...monthFound,
          production: monthFound.production + day.production,
          total_consumed: monthFound.total_consumed + day.total_consumed,
          ZBC_consumed: monthFound.ZBC_consumed + day.ZBC_consumed,
          generation: monthFound.generation + day.generation,
          procentage: Number(
            Number(
              ((monthFound.generation + day.generation) /
                (monthFound.total_consumed + day.total_consumed)) *
                100
            ).toFixed(2)
          ),
          sold: monthFound.sold + day.sold,
          RUP_consumed: monthFound.RUP_consumed + day.RUP_consumed,
          power: null,
          gkal: monthFound.gkal + day.gkal,
          children: isExpanded ? [...monthFound.children, day] : [],
          shadow_children: [...monthFound.shadow_children, day],
        };
      } else {
        // Если нету - добавляем первый день
        months.push({
          month: month,
          year: year,
          date: day.date,
          production: day.production,
          total_consumed: day.total_consumed,
          ZBC_consumed: day.ZBC_consumed,
          generation: day.generation,
          procentage: Number(
            Number((day.generation / day.total_consumed) * 100).toFixed(2)
          ),
          sold: day.sold,
          RUP_consumed: day.RUP_consumed,
          power: null,
          plus: false,
          gkal: day.gkal,
          children: isExpanded ? [day] : [],
          shadow_children: [day],
        });
      }
    });

    months = months.map((month) => ({
      ...month,
      power: +parseFloat(
        "" +
          month.shadow_children.reduce((a, b) => a + (b.power || 0), 0) /
            month.shadow_children.length
      ).toFixed(2),
      plus:
        month.shadow_children.reduce((a, b) => a + +b.plus, 0) >=
        month.shadow_children.length / 2,
      children: month.children.sort(
        (a, b) =>
          new Date((a as IDay).date).getTime() -
          new Date((b as IDay).date).getTime()
      ),
    }));

    // Определяем кварталы
    months.forEach((month) => {
      const year = month.year;
      const kvartal = getKvartalNumber(month.month);

      const kvartalIndex = kvartals.findIndex(
        (item) => item.year === month.year && item.kvartal === kvartal
      );

      const isExpanded =
        expandedRows.includes(`year_${year}.kvartal_${kvartal}`) ||
        expandedRows.length === 0;

      // Если квартал уже есть до добавляем к нему данные за месяц
      if (kvartalIndex > -1) {
        const kvartalFound = kvartals[kvartalIndex];

        kvartals[kvartalIndex] = {
          ...kvartalFound,
          production: kvartalFound.production + month.production,
          total_consumed: kvartalFound.total_consumed + month.total_consumed,
          ZBC_consumed: kvartalFound.ZBC_consumed + month.ZBC_consumed,
          generation: kvartalFound.generation + month.generation,
          procentage: Number(
            Number(
              ((kvartalFound.generation + month.generation) /
                (kvartalFound.total_consumed + month.total_consumed)) *
                100
            ).toFixed(2)
          ),
          sold: kvartalFound.sold + month.sold,
          RUP_consumed: kvartalFound.RUP_consumed + month.RUP_consumed,
          power: null,
          gkal: kvartalFound.gkal + month.gkal,
          children: isExpanded ? [...kvartalFound.children, month] : [],
          shadow_children: [...kvartalFound.shadow_children, month],
        };
      } else {
        // Если нету - добавляем первый месяц
        kvartals.push({
          kvartal: kvartal,
          year: month.year,
          date: month.date,
          production: month.production,
          total_consumed: month.total_consumed,
          ZBC_consumed: month.ZBC_consumed,
          generation: month.generation,
          procentage: Number(
            Number((month.generation / month.total_consumed) * 100).toFixed(2)
          ),
          sold: month.sold,
          RUP_consumed: month.RUP_consumed,
          power: null,
          plus: false,
          gkal: month.gkal,
          children: isExpanded ? [month] : [],
          shadow_children: [month],
        });
      }
    });

    // Определяем года
    kvartals.forEach((kvartal) => {
      const yearIndex = years.findIndex((item) => item.year === kvartal.year);

      const isExpanded =
        expandedRows.includes(`year_${kvartal.year}`) ||
        expandedRows.length === 0;

      // Если год уже есть до добавляем к нему данные за квартал
      if (yearIndex > -1) {
        const yearFound = years[yearIndex];

        years[yearIndex] = {
          ...yearFound,
          production: yearFound.production + kvartal.production,
          total_consumed: yearFound.total_consumed + kvartal.total_consumed,
          ZBC_consumed: yearFound.ZBC_consumed + kvartal.ZBC_consumed,
          generation: yearFound.generation + kvartal.generation,
          procentage: Number(
            Number(
              ((yearFound.generation + kvartal.generation) /
                (yearFound.total_consumed + kvartal.total_consumed)) *
                100
            ).toFixed(2)
          ),
          sold: yearFound.sold + kvartal.sold,
          RUP_consumed: yearFound.RUP_consumed + kvartal.RUP_consumed,
          power: null,
          gkal: yearFound.gkal + kvartal.gkal,
          children: isExpanded ? [...yearFound.children, kvartal] : [],
          shadow_children: [...yearFound.shadow_children, kvartal],
        };
      } else {
        // Если нету - добавляем первый квартал
        years.push({
          year: kvartal.year,
          date: kvartal.year.toString(),
          production: kvartal.production,
          total_consumed: kvartal.total_consumed,
          ZBC_consumed: kvartal.ZBC_consumed,
          generation: kvartal.generation,
          procentage: Number(
            Number((kvartal.generation / kvartal.total_consumed) * 100).toFixed(
              2
            )
          ),
          sold: kvartal.sold,
          RUP_consumed: kvartal.RUP_consumed,
          power: null,
          plus: false,
          gkal: kvartal.gkal,
          children: isExpanded ? [kvartal] : [],
          shadow_children: [kvartal],
        });
      }
    });

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

    let index = 5;

    years.map((year) => {
      ws.cell(index, 1).number(year.year).style(styleCell);
      ws.cell(index, 2).number(year.production).style(styleCell);
      ws.cell(index, 3).number(year.total_consumed).style(styleCell);
      ws.cell(index, 4).number(year.ZBC_consumed).style(styleCell);
      ws.cell(index, 5).number(year.generation).style(styleCell);
      ws.cell(index, 6).number(year.procentage).style(styleCell);
      ws.cell(index, 7).number(year.sold).style(styleCell);
      ws.cell(index, 8).number(year.RUP_consumed).style(styleCell);
      year.power !== null
        ? ws.cell(index, 9).number(year.power).style(styleCell)
        : ws.cell(index, 9).string("").style(styleCell);
      ws.cell(index, 10)
        .string(year.plus ? "+" : "")
        .style(styleCell);
      ws.cell(index, 11).number(year.gkal).style(styleCell);

      index++;

      year.children.forEach((kvartal) => {
        ws.cell(index, 1).string(`${kvartal.kvartal} квартал`).style(styleCell);
        ws.cell(index, 2).number(kvartal.production).style(styleCell);
        ws.cell(index, 3).number(kvartal.total_consumed).style(styleCell);
        ws.cell(index, 4).number(kvartal.ZBC_consumed).style(styleCell);
        ws.cell(index, 5).number(kvartal.generation).style(styleCell);
        ws.cell(index, 6).number(kvartal.procentage).style(styleCell);
        ws.cell(index, 7).number(kvartal.sold).style(styleCell);
        ws.cell(index, 8).number(kvartal.RUP_consumed).style(styleCell);
        kvartal.power !== null
          ? ws.cell(index, 9).number(kvartal.power).style(styleCell)
          : ws.cell(index, 9).string("").style(styleCell);
        ws.cell(index, 10)
          .string(kvartal.plus ? "+" : "")
          .style(styleCell);
        ws.cell(index, 11).number(kvartal.gkal).style(styleCell);

        index++;

        kvartal.children.map((month) => {
          ws.cell(index, 1)
            .string(`${MONTHS[month.month - 1]}`)
            .style(styleCell);
          ws.cell(index, 2).number(month.production).style(styleCell);
          ws.cell(index, 3).number(month.total_consumed).style(styleCell);
          ws.cell(index, 4).number(month.ZBC_consumed).style(styleCell);
          ws.cell(index, 5).number(month.generation).style(styleCell);
          ws.cell(index, 6).number(month.procentage).style(styleCell);
          ws.cell(index, 7).number(month.sold).style(styleCell);
          ws.cell(index, 8).number(month.RUP_consumed).style(styleCell);
          month.power !== null
            ? ws.cell(index, 9).number(month.power).style(styleCell)
            : ws.cell(index, 9).string("").style(styleCell);
          ws.cell(index, 10)
            .string(month.plus ? "+" : "")
            .style(styleCell);
          ws.cell(index, 11).number(month.gkal).style(styleCell);

          index++;

          month.children.map((day) => {
            ws.cell(index, 1)
              .string(`с 1 по ${new Date(day.date).getDate()}`)
              .style(styleCell);
            ws.cell(index, 2).number(day.production).style(styleCell);
            ws.cell(index, 3).number(day.total_consumed).style(styleCell);
            ws.cell(index, 4).number(day.ZBC_consumed).style(styleCell);
            ws.cell(index, 5).number(day.generation).style(styleCell);
            ws.cell(index, 6).number(day.procentage).style(styleCell);
            ws.cell(index, 7).number(day.sold).style(styleCell);
            ws.cell(index, 8).number(day.RUP_consumed).style(styleCell);
            day.power !== null
              ? ws.cell(index, 9).number(day.power).style(styleCell)
              : ws.cell(index, 9).string("").style(styleCell);
            ws.cell(index, 10)
              .string(day.plus ? "+" : "")
              .style(styleCell);
            ws.cell(index, 11).number(day.gkal).style(styleCell);

            index++;
          });
        });
      });
    });

    const filePath = path.join(
      __dirname,
      "../../data/Выработка и потребление электроэнергии.xlsx"
    );

    await new Promise((resolve, reject) => {
      wb.write(filePath, (err, status) => {
        if (err) {
          reject(err);
        } else {
          resolve(status);
        }
      });
    });

    return RESULT.ok;
  } catch (err) {
    console.log(err);
    return RESULT.error;
  }
};
