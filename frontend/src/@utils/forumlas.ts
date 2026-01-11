import { IAssets, TDatasetTimeseries } from '@redux/types/assets';
import { formatPrice } from './functions';

export const clamp = (value: number, max = 500) => Math.max(-max, Math.min(value, max));

export const percentage_change = (current: number, old: number) => ((current - old) / old) * 100;

export const calculate_market_capital = (price: number, supply: number) => price * supply;

export const calculate_volume = (x: number[][]) => x.reduce((acc, cur) => (cur[1] * cur[2]) + acc, 0);

export const calculate_candle_roi = (candle: [number, number, number, number, number, number]) => {
  const [close, open, high, low] = [candle[1], candle[3], candle[4], candle[5]];
  const roi = Number(percentage_change(high, low).toFixed(2))
  if(close > open) return roi
  return -roi
};

export const calculate_w_or_l = ( close: number, open: number, side: string): boolean => {
  if(side === "long") return close > open ? true : false
  return close < open ? true : false
};

export const calculate_trade_metrics = ( close: number, open: number, side: string, size: number, leverage: number = 1): {roi: number; pnl: number} => {
  if (open === 0 || size <= 0 || leverage <= 0) return { roi: 0, pnl: 0 };
  const pnl = side === "long" ? (close - open) * size : (open - close) * size;
  const marginUsed = (open * size);
  const roi = (pnl / marginUsed) * (leverage * 10);
  return { roi, pnl };
};

export type TDistrubition = { x: number; y: number };
export const distribution = (data: number[]) => {
  const mutated: Record<string, number> = {};
  for(const x of data){
    const i = formatPrice(x);
    if(!mutated[i]) mutated[i] = 0;
    mutated[i] += 1;
  };
  const finalize = Object.entries(mutated).map(el => ({x: Number(el[0]), y: Number(el[1])}));
  return finalize
};

export type TEma = { date: number; price: number };
export const ema = (data: TEma[], period: number) => {
  const k = 2 / (period + 1);
  let emaArray: number[] = [];
  data.forEach((point, index) => {
    if (index === 0) {
      emaArray.push(point.price);
    } else {
      const emaPrev = emaArray[index - 1];
      const ema = point.price * k + emaPrev * (1 - k);
      emaArray.push(ema);
    }
  });
  return data.map((point, index) => ({ ...point, ema: emaArray[index] }));
};

// Volatility is calculated by measuring the percentage change of several key data points: the price range (high versus low), price movement (close versus open), and trading activity (current volume versus average volume). Each percentage change is capped at a maximum of 100% to prevent extreme values from skewing the results. These capped values are then summed to produce a single composite volatility index.
export type TCompositeVolatility = { date: number; volatility: number, };
export const composite_volatility = (data: IAssets["dataset_1d"], extreme=100) => {
  const mutated: TCompositeVolatility[] = [];
  const average_volume_total = data.reduce((acc, cur) => acc + (cur[2]), 0) / data.length;
  for(const x of data){
    const [date, close, volume, open, high, low] = x;
    const high_low_index = Math.abs(percentage_change(high, low));
    const volume_index = Math.abs(percentage_change(volume, average_volume_total));
    const close_open_index = Math.abs(percentage_change(close, open));
    mutated.push({date, volatility: high_low_index+volume_index+close_open_index});
  };
  return mutated;
};

export type TWap = { date: number; vwap: number };
export const vwap = (data: IAssets["dataset_1d"]): TWap[] => {
  let cumulativePV = 0;  // Sum of (Typical Price * Volume)
  let cumulativeVolume = 0; // Sum of volume
  const result: TWap[] = [];
  for (const kline of data) {
    const [date, close, volume, , high, low] = kline;
    // Typical Price = (High + Low + Close) / 3
    const typicalPrice = (high + low + close) / 3;
    // Add to cumulative sums
    cumulativePV += typicalPrice * volume;
    cumulativeVolume += volume;
    // VWAP = cumulative PV / cumulative volume
    const vwap = cumulativePV / cumulativeVolume;
    result.push({ date, vwap });
  };
  return result;
};

// Measures how often the asset price is beating previous data points, high > prevHigh, low < prevLow, open > prevOpen, volume > prevVolume, close > prevClose.
export type TEscalation = { date: number; escalation: number };
export const escalation = (data: IAssets["dataset_1d"]): TEscalation[] => {
  const pulseArray: TEscalation[] = [];
  let accumulator = 0;
  for (let i = 0; i < data.length; i++) {
    const [date, close, volume, open, high, low] = data[i];
    if (i === 0) {
      pulseArray.push({ date, escalation: 0 });
      continue;
    }
    const [, prevClose, prevVolume, prevOpen, prevHigh, prevLow] = data[i - 1];
    const index_close = close > prevClose ? 1 : -1;
    const index_volume = volume > prevVolume ? 1 : -1;
    const index_open = open > prevOpen ? 1 : -1;
    const index_high = high > prevHigh ? 1 : -1;
    const index_low = low < prevLow ? 1 : -1;
    const escalation = index_close + index_volume + index_open + index_high + index_low;
    accumulator += escalation;
    pulseArray.push({ date, escalation: accumulator });
  }
  return pulseArray;
};

// Measures how close each candle’s high is to the all-time high in the dataset.
export type TPchigh = { date: number; pchigh: number, };
export const percentage_from_high = (assets: IAssets["dataset_1d"]): TPchigh[] => {
  const pchigh = [];
  if(!assets.length) return [];
  let [highest, lowest] = [assets[0][4]!, assets[0][5]!];
  for(let x of assets){
    const [H, L] = [x[4], x[5]];
    if(H > highest) highest = H;
    if(L < lowest) lowest = L;
  };
  const price_change = highest - lowest;
  for(let x of assets){
    const current_highest = x[4];
    pchigh.push({
      date: x[0],
      pchigh: Number((((price_change - (highest - current_highest)) / price_change) * 100).toFixed(2))
    });
  };
  return pchigh
};

// Current percentage change of close and open price.
export type TRoi = { date: number; roi: number };
export const roi = (assets: IAssets["dataset_1d"]): TRoiAcc[] => {
  const roidataset = [];
  let acc_roi = 0;
  for (const asset of assets) {
      const date = Number(asset[0]);
      const close = Number(asset[1]);
      const open = Number(asset[3]);
      const roi = percentage_change(close, open);
      roidataset.push({date, roi: acc_roi+roi})
  };
  return roidataset
};

export const volume = (candles: number[][]) => {
  return candles.map((el => ({date: el[0], volume: el[1] * el[2]})))
};

// Current percentage change of close and open price.
export type TRsi = {
  date: number;
  rsi: number;
};
export const rsi = ( assets: IAssets["dataset_1d"], period = 14): TRsi[] => {
  const result: TRsi[] = [];
  if (assets.length <= period) return result;
  let gains = 0;
  let losses = 0;
  // --- Initial average gain/loss ---
  for (let i = 1; i <= period; i++) {
    const prevClose = Number(assets[i - 1][1]);
    const close = Number(assets[i][1]);
    const change = close - prevClose;

    if (change > 0) gains += change;
    else losses -= change;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  const firstRS = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const firstRSI = avgLoss === 0 ? 100 : 100 - 100 / (1 + firstRS);
  result.push({
    date: Number(assets[period][0]),
    rsi: firstRSI,
  });

  // --- Subsequent values (smoothed) ---
  for (let i = period + 1; i < assets.length; i++) {
    const prevClose = Number(assets[i - 1][1]);
    const close = Number(assets[i][1]);
    const change = close - prevClose;

    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsiValue = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);

    result.push({
      date: Number(assets[i][0]),
      rsi: rsiValue,
    });
  }

  return result;
};

// Current percentage change of close and open price.
export type TRoiAcc = { date: number; roi: number };
export const accumulated_roi = (assets: IAssets[], timeseries: TDatasetTimeseries): TRoiAcc[] => {
  const map: Record<number, number> = {};
  for (const asset of assets) {
    for (const entry of asset[timeseries]) {
      const date = Number(entry[0]);
      const close = Number(entry[1]);
      const open = Number(entry[3]);
      const roi = percentage_change(close, open);
      if (!map[date]) map[date] = 0;
      map[date] += roi;
    }
  };
  return Object.entries(map)
    .map(([date, roi]) => ({ date, roi }))
    .sort((a, b) => Number(a.date) - Number(b.date))
    .map(el => ({ date: Number(el.date), roi: el.roi }))
};

export type TVolumeAcc = { date: number; volume: number };
export const accumulated_volume = (assets: IAssets[], timeseries: TDatasetTimeseries): TVolumeAcc[] => {
  const map: Record<number, number> = {};
  for (const asset of assets) {
    for (const entry of asset[timeseries]) {
      const date = Number(entry[0]);
      const close = Number(entry[1]);
      const volume = Number(entry[2]);
      const acc = (close * volume);
      if (!map[date]) map[date] = 0;
      map[date] += acc;
    }
  };
  return Object.entries(map)
    .map(([date, volume]) => ({ date, volume }))
    .sort((a, b) => Number(a.date) - Number(b.date))
    .map(el => ({ date: Number(el.date), volume: el.volume }))
};

export type TMarketCapital = { date: number; mcap: number, };
export const accumulated_market_capital = (assets: IAssets[], timeseries: TDatasetTimeseries): TMarketCapital[] => {
  const map: Record<number, number> = {};
  for (const asset of assets) {
    for (const entry of asset[timeseries]) {
      const date = Number(entry[0]);
      const close = Number(entry[1]);
      const supply = asset.supply;
      const mcap = calculate_market_capital(close, supply);
      if (!map[date]) map[date] = 0;
      map[date] += mcap;
    }
  };
  return Object.entries(map)
    .map(([date, mcap]) => ({ date, mcap }))
    .sort((a, b) => Number(a.date) - Number(b.date))
    .map(el => ({ date: Number(el.date), mcap: el.mcap }))
};

export const accumulated_composite_volatility = (assets: IAssets[], timeseries: TDatasetTimeseries, extreme=300): TCompositeVolatility[] => {
  const map: Record<number, number> = {};
  for (const asset of assets) {
    const average_volume_total = asset[timeseries].reduce((acc, cur) => acc + (cur[2]), 0) / asset[timeseries].length;
    for (const x of asset[timeseries]) {
      const [date, close, volume, open, high, low] = x;
      const high_low_index = Math.abs(percentage_change(high, low));
      const volume_index = Math.abs(percentage_change(volume, average_volume_total));
      const close_open_index = Math.abs(percentage_change(close, open));
      const volatility = (clamp(volume_index, extreme)+clamp(close_open_index, extreme)+clamp(high_low_index, extreme));
      if (!map[date]) map[date] = 0;
      map[date] += volatility;
    }
  };
  return Object.entries(map)
    .map(([date, volatility]) => ({ date, volatility }))
    .sort((a, b) => Number(a.date) - Number(b.date))
    .map(el => ({ date: Number(el.date), volatility: el.volatility }))
};

export const accumulated_escalation = ( assets: IAssets[], timeseries: TDatasetTimeseries): TEscalation[] => {
  const map: Record<number, number> = {};
  for (const asset of assets) {
    const data = asset[timeseries];
    for (let i = 0; i < data.length; i++) {
      const [date, close, volume, open, high, low] = data[i];
      if (i === 0) {
        // Initialize first point
        if (!map[date]) map[date] = 0;
        continue;
      }
      const [, prevClose, prevVolume, prevOpen, prevHigh, prevLow] = data[i - 1];

      const index_close = close > prevClose ? 1 : -1;
      const index_volume = volume > prevVolume ? 1 : -1;
      const index_open = open > prevOpen ? 1 : -1;
      const index_high = high > prevHigh ? 1 : -1;
      const index_low = low < prevLow ? 1 : -1;
      const escalation = index_close + index_volume + index_open + index_high + index_low;
      if (!map[date]) map[date] = 0;
      map[date] += escalation; // accumulate across assets
    }
  }
  return Object.entries(map)
    .map(([date, escalation]) => ({ date: Number(date), escalation }))
    .sort((a, b) => a.date - b.date);
};
