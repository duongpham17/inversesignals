export const formatNumbersToString = (value: any): string => {
  const n = Number(value);
  if (isNaN(n)) return "0";
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000_000) return (n / 1_000_000_000_000).toFixed(2).replace(/\.00$/, "") + "T";
  if (abs >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B";
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
  if (abs >= 1_000) return (n / 1_000).toFixed(2).replace(/\.00$/, "") + "k";
  if (abs >= 1) return n.toFixed(2).replace(/\.00$/, "");
  return n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
};

export const formatPrice = (x: number) => {
  if (x === 0) return 0;
  const [sign, v] =[ Math.sign(x), Math.abs(x) ];
  let rounded;
  if (v >= 100000) rounded = Math.round(v / 5000) * 5000;
  else if (v >= 10000) rounded = Math.round(v / 1000) * 1000;
  else if (v >= 1000) rounded = Math.round(v / 100) * 100;
  else if (v >= 10) rounded = Math.round(v);
  else if (v >= 1) rounded = Math.floor(v);
  else if (v >= 0.95) rounded = Math.round(v * 100) / 100;
  else if (v >= 0.1) rounded = Math.floor(v / 0.05) * 0.05;
  else if (v >= 0.05) rounded = 0.05;
  else rounded = 0;
  rounded = Number(rounded.toFixed(2));
  const result = rounded * sign;
  return Object.is(result, -0) ? 0 : result;
};

export const formatDate = (n: number): string => {
  const date = new Date(n);
  const dateString = date.toDateString();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${dateString} ${hours}:${minutes}`
};

export const priceFormat = (price: number) => {
  if (price < 1) return { precision: 4, minMove: 0.0001 };
  if (price < 100) return { precision: 3, minMove: 0.001 };
  if (price >= 10000)  return { precision: 2, minMove: 0.01 };
  return { precision: 2, minMove: 0.01 };
};

export const dateDifference = ( oldDate: number,closeDate: number): { hours: number; minutes: number, string: string } => {
  const diffInMs = Math.abs(closeDate - oldDate);
  const totalMinutes = Math.floor(diffInMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const string = `${hours}H:${minutes}M`
  return { hours, minutes, string };
};