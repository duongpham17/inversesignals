import { IAssets, TDatasetTimeseries } from '@redux/types/assets';

export type TCandle = IAssets["dataset_1h"][0];
export type TData = [number, number, number, number, number];

export const Hammer = (data: TCandle[], datapoint: number): TData[] => {
  let result: TData[] = [];

  const sliceData = data.slice(-datapoint); // last `datapoint` candles

  for (let i = 0; i < sliceData.length; i++) {
    const [date, close, /* volume */, open, high, low] = sliceData[i];

    const body = Math.abs(close - open);
    const lowerWick = Math.min(open, close) - low;
    const upperWick = high - Math.max(open, close);

    // Skip doji
    if (body === 0) continue;

    const hasLongLowerWick = lowerWick >= 2 * body; // at least 2× body
    const hasSmallUpperWick = upperWick <= body;    // little or no upper wick

    // Simple downtrend check: previous 3 closes descending
    const prevCloses = sliceData.slice(Math.max(0, i - 3), i).map(c => c[1]);
    const downtrend = prevCloses.every((c, idx, arr) => idx === 0 || c < arr[idx - 1]);

    // If all conditions match, it's a hammer
    if (hasLongLowerWick && hasSmallUpperWick && downtrend) {
      result.push([open, close, high, low, date]); // store necessary info
    }
  }

  return result;
};

export const InverseHammer = (data: TCandle[], datapoint: number): TData[] => {
  let result: TData[] = [];

  const sliceData = data.slice(-datapoint); // last `datapoint` candles

  for (let i = 0; i < sliceData.length; i++) {
    const [date, close, , open, high, low] = sliceData[i];

    const body = Math.abs(close - open);
    const lowerWick = Math.min(open, close) - low;
    const upperWick = high - Math.max(open, close);

    // Skip doji
    if (body === 0) continue;

    const hasLongUpperWick = upperWick >= 2 * body; // at least 2× body
    const hasSmallLowerWick = lowerWick <= body;    // little or no lower wick

    // Simple downtrend check: previous 3 closes descending
    const prevCloses = sliceData.slice(Math.max(0, i - 3), i).map(c => c[1]);
    const downtrend = prevCloses.every((c, idx, arr) => idx === 0 || c < arr[idx - 1]);

    // If all conditions match, it's an inverse hammer
    if (hasLongUpperWick && hasSmallLowerWick && downtrend) {
      result.push([open, close, high, low, date]); // store necessary info
    }
  }

  return result;
};

export const BullishEngulfing = (data: TCandle[], datapoint: number): TData[] => {
  const result: TData[] = [];

  const sliceData = data.slice(-datapoint);

  for (let i = 1; i < sliceData.length; i++) {
    const [date, close, /* volume */ , open, high, low] = sliceData[i];
    const [/* prevDate */ , prevClose, /* prevVolume */, prevOpen, /* prevHigh */, /* prevLow */ ] = sliceData[i - 1];

    const body = Math.abs(close - open);
    const upperWick = high - Math.max(open, close);
    const lowerWick = Math.min(open, close) - low;

    // Previous candle must be bearish
    const prevBear = prevClose < prevOpen;

    // Current candle bullish
    const currBull = close > open;

    // Bullish candle body engulfs previous candle
    const engulfsPrev = open <= prevClose && close >= prevOpen;

    // Minimal wicks
    const smallWicks = upperWick <= body && lowerWick <= body;

    // Downtrend check: previous 3 closes ending at previous candle descending
    const prevCloses = sliceData.slice(Math.max(0, i - 4), i - 1).map(c => c[1]);
    const downtrend = prevCloses.every((c, idx, arr) => idx === 0 || c < arr[idx - 1]);

    if (prevBear && currBull && engulfsPrev && smallWicks && downtrend) {
      result.push([open, close, high, low, date]);
    }
  }

  return result;
};

export const MorningStar = (
  data: TCandle[],
  datapoint: number
): TData[] => {
  const result: TData[] = [];
  const sliceData = data.slice(-datapoint);

  for (let i = 2; i < sliceData.length; i++) {
    const c1 = sliceData[i - 2];
    const c2 = sliceData[i - 1];
    const c3 = sliceData[i];

    const [/*date1*/, close1, , open1, high1, low1] = c1;
    const [/*date2*/, close2, , open2, high2, low2] = c2;
    const [date3, close3, , open3, high3, low3] = c3;

    const body1 = Math.abs(close1 - open1);
    const body2 = Math.abs(close2 - open2);
    const body3 = Math.abs(close3 - open3);

    const range1 = high1 - low1;
    const range2 = high2 - low2;
    const range3 = high3 - low3;

    // --- Candle types ---
    const firstBearish = close1 < open1;
    const secondSmall = body2 <= range2 * 0.3; // doji / spinning top
    const thirdBullish = close3 > open3;

    // --- Strong bullish recovery ---
    const midpoint1 = open1 - body1 * 0.5;
    const closesIntoFirst = close3 >= midpoint1;

    // --- Downtrend before pattern ---
    const prevCloses = sliceData
      .slice(Math.max(0, i - 6), i - 2)
      .map(c => c[1]);

    const downtrend =
      prevCloses.length >= 3 &&
      prevCloses.every(
        (c, idx, arr) => idx === 0 || c < arr[idx - 1]
      );

    // --- Strength filters (optional but recommended) ---
    const strongBodies =
      body1 >= range1 * 0.5 &&
      body3 >= range3 * 0.5;

    if (
      firstBearish &&
      secondSmall &&
      thirdBullish &&
      closesIntoFirst &&
      downtrend &&
      strongBodies
    ) {
      result.push([open3, close3, high3, low3, date3]);
    }
  }

  return result;
};

export const Doji = ( data: TCandle[], datapoint: number): TData[] => {
  const result: TData[] = [];
  const sliceData = data.slice(-datapoint);

  for (const candle of sliceData) {
    const [date, close, , open, high, low] = candle;

    const body = Math.abs(close - open);
    const range = high - low;

    // Avoid flat / invalid candles
    if (range === 0) continue;

    const isDoji = body <= range * 0.1;

    if (isDoji) {
      result.push([open, close, high, low, date]);
    }
  }

  return result;
};

export const SpinningTop = (data: TCandle[], datapoint: number): TData[] => {
  const result: TData[] = [];
  const sliceData = data.slice(-datapoint);

  for (const candle of sliceData) {
    const [date, close, , open, high, low] = candle;

    const range = high - low;
    if (range === 0) continue;

    const body = Math.abs(close - open);
    const upperWick = high - Math.max(open, close);
    const lowerWick = Math.min(open, close) - low;

    const smallBody = body <= range * 0.3 && body > range * 0.1;

    const wickBalance =
      Math.abs(upperWick - lowerWick) <= range * 0.2;

    if (smallBody && wickBalance) {
      result.push([open, close, high, low, date]);
    }
  }

  return result;
};

export const HangingMan = (data: TCandle[], datapoint: number): TData[] => {
  const result: TData[] = [];
  const sliceData = data.slice(-datapoint);

  for (let i = 0; i < sliceData.length; i++) {
    const [date, close, , open, high, low] = sliceData[i];

    const body = Math.abs(close - open);
    const range = high - low;
    if (range === 0 || body === 0) continue;

    const lowerWick = Math.min(open, close) - low;
    const upperWick = high - Math.max(open, close);

    // --- Hammer shape ---
    const longLowerWick = lowerWick >= body * 2;
    const smallUpperWick = upperWick <= body * 0.5;
    const smallBody = body <= range * 0.3;

    // --- Uptrend before pattern ---
    const prevCloses = sliceData
      .slice(Math.max(0, i - 4), i)
      .map(c => c[1]);

    const uptrend =
      prevCloses.length >= 3 &&
      prevCloses.every(
        (c, idx, arr) => idx === 0 || c > arr[idx - 1]
      );

    if (longLowerWick && smallUpperWick && smallBody && uptrend) {
      result.push([open, close, high, low, date]);
    }
  }

  return result;
};

export const ShootingStar = ( data: TCandle[], datapoint: number): TData[] => {
  const result: TData[] = [];
  const sliceData = data.slice(-datapoint);

  for (let i = 0; i < sliceData.length; i++) {
    const [date, close, , open, high, low] = sliceData[i];

    const body = Math.abs(close - open);
    const range = high - low;
    if (range === 0 || body === 0) continue;

    const upperWick = high - Math.max(open, close);
    const lowerWick = Math.min(open, close) - low;

    // --- Inverse Hammer shape ---
    const longUpperWick = upperWick >= body * 2;
    const smallLowerWick = lowerWick <= body * 0.5;
    const smallBody = body <= range * 0.3;

    // --- Uptrend before pattern ---
    const prevCloses = sliceData
      .slice(Math.max(0, i - 4), i)
      .map(c => c[1]);

    const uptrend =
      prevCloses.length >= 3 &&
      prevCloses.every(
        (c, idx, arr) => idx === 0 || c > arr[idx - 1]
      );

    if (longUpperWick && smallLowerWick && smallBody && uptrend) {
      result.push([open, close, high, low, date]);
    }
  }

  return result;
};


export interface CandlePattern {
  name: string;
  detect: (asset: IAssets, timeseries: TDatasetTimeseries, datapoints: number) => any[];
};

export const candlePatterns: CandlePattern[] = [
 {
    name: 'Hammer',
    detect: (asset, ts, n) => Hammer(asset[ts], n),
  },
  {
    name: 'Inverse Hammer',
    detect: (asset, ts, n) => InverseHammer(asset[ts], n),
  },
  {
    name: 'Bullish Engulfing',
    detect: (asset, ts, n) => BullishEngulfing(asset[ts], n),
  },
  {
    name: "Morning Star",
    detect: (asset, ts, n) => MorningStar(asset[ts], n),
  },
  {
    name: "Doji",
    detect: (asset, ts, n) => Doji(asset[ts], n),
  },
  {
    name: "SpinningTop",
    detect: (asset, ts, n) => SpinningTop(asset[ts], n),
  },
  {
    name: "Hanging Man",
    detect: (asset, ts, n) => HangingMan(asset[ts], n),
  },
  {
    name: "Shooting Star",
    detect: (asset, ts, n) => ShootingStar(asset[ts], n),
  }
];

export const candleInformation = [
   {
    name: 'Hammer',
    description: `
    The Hammer is most meaningful when it appears after a downtrend, as it may indicate a potential bullish reversal.
    (BULL) If the candle closes above its opening price (green/white), it's a strong bullish signal.
    (BEAR) If it closes below its opening price (red/black), it's still a Hammer, but the signal is weaker.
    `,
  },
  {
    name: 'Inverse Hammer',
    description: `
    The Inverse Hammer is most meaningful when it appears after a downtrend, as it may indicate a potential bullish reversal.
    The upper wick should be 2-3 times the size of the body, with little or no lower wick.
    (BULL) If the candle closes above its opening price (green/white), it's a strong bullish signal.
    (BEAR) If it closes below its opening price (red/black), it's still an Inverse Hammer, but the signal is weaker.
   `
  },
  {
    name: 'Bullish Engulfing',
    description: `
    The Bullish Engulfing pattern is most meaningful when it appears after a downtrend, as it may indicate a potential bullish reversal.
    It consists of two candles:
    A bearish candle (red/black) that forms part of the downtrend.
    A bullish candle (green/white) that completely engulfs the body of the previous candle.
    The bullish candle shows strong buyer control, closing above the previous candle's high.
    The candle should have minimal or no upper or lower wick, signaling a decisive move toward the upside.
    `,
  },
  {
    name: "Morning Star",
    description: `
    The Morning Star pattern is most meaningful when it appears after a downtrend, as it may indicate a potential bullish reversal.

    It consists of three candles:
    A long bearish candle (red/black) that continues the downtrend.
    A small candle (Doji or Spinning Top), which can be bullish or bearish, representing indecision.
    A long bullish candle (green/white) that closes well into the body of the first candle.
    This pattern shows that sellers lost momentum, and buyers began taking control, potentially signaling the start of an uptrend
    `
  },
  {
    name: "Doji",
    description: `
    The Doji pattern is characterized by a very small or non-existent body, resembling a plus sign.
    The upper and lower wicks are also small, though their lengths may vary.
    It indicates market indecision, as buyers and sellers are evenly matched and the open and close are nearly the same.
    While a Doji alone signals hesitation, it can contribute to reversal patterns when combined with other candles, such as the Morning Star or Evening Star.
    `
  },
  {
    name: "SpinningTop",
    description: `
    The Spinning Top pattern consists of candles with small bodies and wicks of roughly equal length.
    It represents a stalemate between buyers and sellers, as the price closes near its opening level.
    This pattern often appears after a strong uptrend or downtrend, indicating a period of consolidation.
    Depending on the market context:
    It may signal the trend will continue after a brief pause.
    Or it could indicate a potential reversal if it forms at the top of an uptrend or bottom of a downtrend.
    It shows that either buyers or sellers are losing control, highlighting indecision in the market.
    `,
  },
  {
    name: "Hanging Man",
    description: `
    The Hanging Man pattern is most meaningful when it appears after an uptrend, as it may indicate a potential bearish reversal.
    Its shape is similar to a Hammer, with a small body and a long lower wick, and little or no upper wick.
    During the session, sellers pushed the price down, but buyers temporarily drove it back up.
    However, the buyers could not sustain control, suggesting that momentum may shift toward the downside.
    `,
  },
  {
    name: "Shooting Star",
    description: `
    The Shooting Star pattern is most meaningful when it appears after an uptrend, as it may indicate a potential bearish reversal.
    Its shape is similar to an Inverse Hammer, with a small body near the session's low and a long upper wick, with little or no lower wick.
    During the session, buyers initially pushed the price higher, but sellers returned and drove it back down, suggesting that upward momentum is weakening and a reversal may occur.
    `,
  }
]