export interface IYear {
  year: number;
  production: number;
  total_consumed: number;
  ZBC_consumed: number;
  generation: number;
  procentage: number;
  sold: number;
  RUP_consumed: number;
  gkal: number;
  days?: IDay[];
}

export interface IDay {
  date: Date;
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
