import styles from './Candlesticks.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, CandlestickData, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { formatDate, formatNumbersToString} from '@utils/functions';
import { calculate_trade_metrics } from '@utils/forumlas';

interface CandlestickWithVolume extends CandlestickData<number> {
  volume: number;
}

interface Annotation {
  open: number;
  side: string;
  size: number;
  leverage: number;
}

interface Props {
  data: number[][]; // [[time(ms), close, volume, open, high, low], ...]
  height?: number;
  annotations?: Annotation[];
}

const calculateEMA = ( candles: CandlestickWithVolume[], period: number) => {
  if (candles.length < period) return [];
  const k = 2 / (period + 1);
  const ema: { time: number; value: number }[] = [];
  const sma = candles.slice(0, period).reduce((s, c) => s + c.close, 0) / period;
  let prev = sma;
  for (let i = period - 1; i < candles.length; i++) {
    const value = candles[i].close * k + prev * (1 - k);
    prev = value;

    ema.push({ time: candles[i].time, value });
  }
  return ema;
};

export const calculateVWAP = (candles: CandlestickWithVolume[]) => {
  let cumulativePV = 0;       // Sum of (TypicalPrice * Volume)
  let cumulativeVolume = 0;   // Sum of Volume
  const vwapSeries = [];
  for (const candle of candles) {
    // Compute Typical Price for this candle
    const typicalPrice = (candle.high + candle.low + candle.close) / 3;
    // Update cumulative sums
    cumulativePV += typicalPrice * candle.volume;
    cumulativeVolume += candle.volume;
    // Compute VWAP at this candle
    const vwap = cumulativePV / cumulativeVolume;
    // Push to result array
    vwapSeries.push({
      time: candle.time,  // already in seconds
      value: vwap,
    });
  }

  return vwapSeries;
};


const Candlestick: React.FC<Props> = ({ data, height = 300, annotations = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<any>(null);
  const ema21Ref = useRef<any>(null);
  const ema9Red = useRef<any>(null);
  const vwapRef = useRef<any>(null);
  const tradeLinesRef = useRef<any[]>([]); // store all trade lines

  const [tooltip, setTooltip] = useState<{
    time: number;
    open: number;
    close: number;
    high: number;
    low: number;
    ema9Red?: number;
    ema21Ref?: number;
    vwap?: number;
  }>({ time: 0, open: 0, close: 0, high: 0, low: 0 });

  const candles: CandlestickWithVolume[] = [...data]
    .map(([t, c, v, o, h, l]) => ({
      time: Math.floor(t / 1000),
      open: o,
      high: h,
      low: l,
      close: c,
      volume: v,
    }))
    .sort((a, b) => a.time - b.time);

  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: 'transparent' },
        horzLines: { color: 'transparent' },
      },
      rightPriceScale: { borderColor: '#2b2b2b' },
      timeScale: { borderColor: '#2b2b2b', timeVisible: true },
    });

    // add series
    candleRef.current = chartRef.current.addSeries(CandlestickSeries);
    ema21Ref.current = chartRef.current.addSeries(LineSeries, { color: '#ffff00', lineWidth: 2, priceLineVisible: false});
    ema9Red.current = chartRef.current.addSeries(LineSeries, { color: '#2474f5', lineWidth: 2, priceLineVisible: false });
    vwapRef.current = chartRef.current.addSeries(LineSeries, { color: '#e684eaec', lineWidth: 2, priceLineVisible: false });

    return () => chartRef.current?.remove();
  }, [height]);

  const addTradeLine = (series: any, price: number, side: string, label: string, color: string) => {
    const line = {
      price,
      color,
      lineWidth: 1,
      lineStyle: 0,
      title: label,
      titleColor: color,
      axisLabelVisible: true,
      axisLabelColor: color,
    };
    return series.createPriceLine(line);
  };

  useEffect(() => {
    if (!candleRef.current) return;

    candleRef.current.setData(candles);
    ema21Ref.current?.setData(calculateEMA(candles, 21));
    ema9Red.current?.setData(calculateEMA(candles, 9));
    vwapRef.current?.setData(calculateVWAP(candles));

    const latestPrice = candles[candles.length - 1]?.close;

    // Remove old trade lines
    tradeLinesRef.current.forEach(line => candleRef.current.removePriceLine(line));
    tradeLinesRef.current = [];

    // Add new trade lines from annotations
    annotations.forEach((trade, index) => {
      const pnl = Number(calculate_trade_metrics(latestPrice, trade.open, trade.side, trade.size, trade.leverage).pnl.toFixed(2));
      const label = `${trade.side.charAt(0).toUpperCase()} ${formatNumbersToString(trade.size)} @ ${trade.open} ${pnl}`;
      const color = pnl > 0 ? '#54d26f' : '#e16363';
      const line = addTradeLine(candleRef.current, trade.open, trade.side, label, color);
      tradeLinesRef.current.push(line);
    });
  }, [candles, annotations]);

  useEffect(() => {
    if (!chartRef.current || !candleRef.current) return;

    const handleHover = (param: any) => {
      if (!param.time || !param.seriesData) return;

      const candle = param.seriesData.get(candleRef.current);
      if (!candle) return;

      const ema9Value = param.seriesData.get(ema9Red.current)?.value;
      const ema21Value = param.seriesData.get(ema21Ref.current)?.value;
      const vwapValue = param.seriesData.get(vwapRef.current)?.value;

      setTooltip(prev => {
        if (
          prev.time === candle.time &&
          prev.open === candle.open &&
          prev.high === candle.high &&
          prev.low === candle.low &&
          prev.close === candle.close &&
          prev.ema9Red === ema9Value &&
          prev.ema21Ref === ema21Value &&
          prev.vwap === vwapValue
        ) {
          return prev;
        }
        return {
          time: candle.time,
          open: candle.open,
          close: candle.close,
          high: candle.high,
          low: candle.low,
          ema9Red: ema9Value,
          ema21Ref: ema21Value,
          vwap: vwapValue,
        };
      });
    };

    chartRef.current.subscribeCrosshairMove(handleHover);

    return () => {
      chartRef.current?.unsubscribeCrosshairMove(handleHover);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <p>{formatDate(tooltip.time * 1000)}</p>
        <p>
          <span>C:{tooltip.close}</span> 
          <span className={styles.high}>H:{tooltip.high}</span> 
          <span className={styles.low}>L:{tooltip.low}</span>
        </p>
        <p>
          <span className={styles.ema9}>EMA9:{tooltip.ema9Red?.toFixed(4)}</span> 
          <span className={styles.ema21}>EMA21:{tooltip.ema21Ref?.toFixed(4)}</span> 
          <span className={styles.vwap}>VWAP:{tooltip.vwap?.toFixed(4)}</span>
        </p>
      </div>
      <div ref={containerRef} style={{ width: '100%', height }} />
    </div>
  );
};

export default Candlestick;