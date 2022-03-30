export interface IYear {
  year: number;
  date: string;
  production: number;
  total_consumed: number;
  ZBC_consumed: number;
  generation: number;
  procentage: number;
  sold: number;
  RUP_consumed: number;
  power: number;
  plus: boolean;
  gkal: number;
  children: IKvartal[];
}

export interface IKvartal {
  year: number;
  kvartal: number;
  date: string;
  production: number;
  total_consumed: number;
  ZBC_consumed: number;
  generation: number;
  procentage: number;
  sold: number;
  RUP_consumed: number;
  power: number;
  plus: boolean;
  gkal: number;
  children: IMonth[];
}

export interface IMonth {
  year: number;
  month: number;
  date: string;
  production: number;
  total_consumed: number;
  ZBC_consumed: number;
  generation: number;
  procentage: number;
  sold: number;
  RUP_consumed: number;
  power: number;
  plus: boolean;
  gkal: number;
  children: IDay[];
}

export interface IDay {
  date: string;
  production: number;
  total_consumed: number;
  ZBC_consumed: number;
  generation: number;
  procentage: number;
  sold: number;
  RUP_consumed: number;
  power: number;
  plus: boolean;
  gkal: number;
}

export enum RESULT {
  ok,
  error,
  idle,
}

export const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];
