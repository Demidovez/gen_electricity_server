export const getKvartalNumber = (month: number): number => {
  return Math.ceil(month / 3);
};
