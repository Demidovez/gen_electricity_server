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
  power: number | null;
  plus: boolean;
  gkal: number;
  children: IKvartal[];
  shadow_children: IKvartal[];
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
  power: number | null;
  plus: boolean;
  gkal: number;
  children: IMonth[];
  shadow_children: IMonth[];
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
  power: number | null;
  plus: boolean;
  gkal: number;
  children: IDay[];
  shadow_children: IDay[];
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
  power: number | null;
  plus: boolean;
  gkal: number;
}

export interface IUser {
  id: number;
  login: string;
  firstname: string;
  lastname: string;
  secondname: string;
  role: string;
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
