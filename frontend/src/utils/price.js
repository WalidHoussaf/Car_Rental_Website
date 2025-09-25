
export const getNumericPrice = (car) => {
  if (!car) return 0;
  const p = car.pricePerDay ?? car.price ?? 0;
  const n = typeof p === 'string' ? parseFloat(p) : p;
  return Number.isFinite(n) ? n : 0;
};

export const calcBasePrice = (car, totalDays = 1) => {
  const daily = getNumericPrice(car);
  const days = Number.isFinite(totalDays) && totalDays > 0 ? totalDays : 1;
  return daily * days;
};

export const formatCurrency = (value) => {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  const safe = Number.isFinite(n) ? n : 0;
  return safe;
};
