import { IDay } from "../types/types";

export default {
  getYears: () => `
    SELECT 
        DATEPART(YEAR, date) as year 
        ,SUM(production) as production
        ,SUM(total_consumed) as total_consumed
        ,SUM(ZBC_consumed) as ZBC_consumed
        ,SUM(generation) as generation
        ,SUM(procentage) as procentage
        ,SUM(sold) as sold
        ,SUM(RUP_consumed) as RUP_consumed
        ,SUM(gkal) as gkal 
    FROM [Apps].[dbo].[gen_electricity] 
    GROUP BY DATEPART(YEAR, date) 
    ORDER BY DATEPART(YEAR, date);
    `,
  getDays: (year: number) => `
    SELECT TOP (366) 
        [date]
        ,[production]
        ,[total_consumed]
        ,[ZBC_consumed]
        ,[generation]
        ,[procentage]
        ,[sold]
        ,[RUP_consumed]
        ,[power]
        ,[plus]
        ,[gkal]
    FROM [Apps].[dbo].[gen_electricity] 
        where DATEPART(YEAR, date) = ${
          year ||
          "(SELECT TOP 1 DATEPART(YEAR, date) FROM [Apps].[dbo].[gen_electricity] ORDER BY date DESC)"
        }
    ORDER BY date;
    `,
  updateDay: (day: IDay) => `
    UPDATE [Apps].[dbo].[gen_electricity]
    SET
       [production] = ${day.production}
      ,[total_consumed] = ${day.total_consumed}
      ,[ZBC_consumed] = ${day.ZBC_consumed}
      ,[generation] = ${day.generation}
      ,[procentage] = ${day.procentage}
      ,[sold] = ${day.sold}
      ,[RUP_consumed] = ${day.RUP_consumed}
      ,[power] = ${day.power}
      ,[plus] = ${+day.plus}
      ,[gkal] = ${day.gkal}
    WHERE date = '${new Date(day.date).getFullYear()}-${
    new Date(day.date).getMonth() + 1
  }-${new Date(day.date).getDate()}'
    
    `,
  insertDay: (day: IDay) => `
    INSERT INTO [Apps].[dbo].[gen_electricity] (date, production, total_consumed, ZBC_consumed, generation, procentage, sold, RUP_consumed, power, plus, gkal)
    VALUES (
      '${new Date(day.date).getFullYear()}-${
    new Date(day.date).getMonth() + 1
  }-${new Date(day.date).getDate()}', 
      ${day.production}, 
      ${day.total_consumed}, 
      ${day.ZBC_consumed}, 
      ${day.generation}, 
      ${day.procentage}, 
      ${day.sold}, 
      ${day.RUP_consumed}, 
      ${day.power}, 
      ${+day.plus}, 
      ${day.gkal});
  `,
  deleteDay: (date: string) => `
    DELETE FROM [Apps].[dbo].[gen_electricity] WHERE date = '${new Date(
      date
    ).getFullYear()}-${new Date(date).getMonth() + 1}-${new Date(
    date
  ).getDate()}';
  `,
  getDaysSinceYear: (year: number) => `
  SELECT  
        [date]
        ,[production]
        ,[total_consumed]
        ,[ZBC_consumed]
        ,[generation]
        ,[procentage]
        ,[sold]
        ,[RUP_consumed]
        ,[power]
        ,[plus]
        ,[gkal]
    FROM [Apps].[dbo].[gen_electricity] 
        where DATEPART(YEAR, date) < ${year}
    ORDER BY date;
  `,
};
