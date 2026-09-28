import styles from './Candlesticks.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import useWindowSize from '@hooks/useWindow';
import { createChart, IChartApi, CandlestickData, CandlestickSeries, LineSeries } from 'lightweight-charts';
import { formatDate, formatNumbersToString} from '@utils/functions';
import { calculate_trade_metrics, percentage_change } from '@utils/forumlas';

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
  precision?: number,
  minMove?: number
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
  let cumulativePV = 0;
  let cumulativeVolume = 0;

  return candles
    .map(candle => {
      const { time, high, low, close, volume } = candle;

      if (
        high == null ||
        low == null ||
        close == null ||
        volume == null ||
        volume <= 0
      ) {
        return null;
      }

      const typicalPrice = (high + low + close) / 3;
      cumulativePV += typicalPrice * volume;
      cumulativeVolume += volume;

      if (cumulativeVolume === 0) return null;

      const vwap = cumulativePV / cumulativeVolume;
      if (!Number.isFinite(vwap)) return null;

      return { time, value: vwap };
    })
    .filter(Boolean);
};

const Candlestick: React.FC<Props> = ({ data, height=300, annotations=[], precision=2, minMove=0.01 }) => {
  const {width} = useWindowSize()
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<any>(null);
  const ema100ref = useRef<any>(null);
  const ema200ref = useRef<any>(null);
  const vwapRef = useRef<any>(null);
  const tradeLinesRef = useRef<any[]>([]); // store all trade lines

  const [tooltip, setTooltip] = useState<{
    time: number;
    open: number;
    close: number;
    high: number;
    low: number;
    ema200ref?: number;
    ema100ref?: number;
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

    const container = containerRef.current;
    const color = "transparent";

    chartRef.current = createChart(containerRef.current, {
      width: width >= 1200 ? 1200 : width - 40,
      height,
      layout: { background: { color }, textColor: '#d1d4dc'},
      grid: { vertLines: { color }, horzLines: { color }},
      rightPriceScale: { borderColor: color },
      timeScale: {borderColor: color}
    });

    // add series
    candleRef.current = chartRef.current.addSeries(CandlestickSeries, {priceFormat: {precision, minMove}});
    ema100ref.current = chartRef.current.addSeries(LineSeries, { color: '#2474f5', lineWidth: 2, priceLineVisible: false});
    ema200ref.current = chartRef.current.addSeries(LineSeries, { color: '#ffff00', lineWidth: 2, priceLineVisible: false });
    vwapRef.current = chartRef.current.addSeries(LineSeries, { color: '#e684eaec', lineWidth: 2, priceLineVisible: false });
    
    // Add right-click reset
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      chartRef.current?.timeScale().fitContent();
      chartRef.current?.priceScale('right').applyOptions({ autoScale: true });
    };

    container.addEventListener('contextmenu', handleRightClick);

    return () => {
      chartRef.current?.remove();
      container.removeEventListener('contextmenu', handleRightClick); // ✅ use local variable
    };
  }, [height, width, precision, minMove]);

  const addTradeLine = (series: any, price: number, label: string, color: string) => {
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

    candleRef.current?.setData(candles);
    ema100ref.current?.setData(calculateEMA(candles, 100));
    ema200ref.current?.setData(calculateEMA(candles, 200));
    vwapRef.current?.setData(calculateVWAP(candles));

    const latestPrice = candles[candles.length - 1]?.close;

    // Remove old trade lines
    tradeLinesRef.current.forEach(line => candleRef.current.removePriceLine(line));
    tradeLinesRef.current = [];

    // Add new trade lines from annotations
    annotations.forEach((trade) => {
      const pnl = Number(calculate_trade_metrics(latestPrice, trade.open, trade.side, trade.size, trade.leverage).pnl.toFixed(2));
      const label = `${trade.side.charAt(0).toUpperCase()} ${formatNumbersToString(trade.size)} @ ${trade.open} ${pnl}`;
      const color = pnl > 0 ? '#54d26f' : '#e16363';
      const line = addTradeLine(candleRef.current, trade.open, label, color);
      tradeLinesRef.current.push(line);
    });
  }, [candles, annotations]);

  useEffect(() => {
    if (!chartRef.current || !candleRef.current) return;

    const handleHover = (param: any) => {
      if (!param.time || !param.seriesData) return;

      const candle = param.seriesData.get(candleRef.current);
      if (!candle) return;

      const ema200value = param.seriesData.get(ema200ref.current)?.value;
      const ema100Value = param.seriesData.get(ema100ref.current)?.value;
      const vwapValue = param.seriesData.get(vwapRef.current)?.value;

      setTooltip(prev => {
        if (
          prev.time === candle.time &&
          prev.open === candle.open &&
          prev.high === candle.high &&
          prev.low === candle.low &&
          prev.close === candle.close &&
          prev.ema200ref === ema200value &&
          prev.ema100ref === ema100Value &&
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
          ema200ref: ema200value,
          ema100ref: ema100Value,
          vwap: vwapValue,
        };
      });
    };

    chartRef.current.subscribeCrosshairMove(handleHover);

    return () => {
      chartRef.current?.unsubscribeCrosshairMove(handleHover);
    };
  }, []);

  useEffect(() => {
  if (!chartRef.current || !candleRef.current) return;

  const handleClick = (param: any) => {
    if (!param.time || !param.seriesData) return;

    const candle = param.seriesData.get(candleRef.current);
    if (!candle) return;

    const textToCopy = `${candle.time * 1000}, ${candle.close}, 0, ${candle.open}, ${candle.high}, ${candle.low}`

    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Candle data copied to clipboard');
    }).catch(err => {
      console.error('Clipboard copy failed', err);
    });
  };

  chartRef.current.subscribeClick(handleClick);

  return () => {
    chartRef.current?.unsubscribeClick(handleClick);
  };
}, []);

  return (
    <div className={styles.container}>
      <div>
        <div>
        <p><span className={styles.date}>{formatDate(tooltip.time * 1000)}</span></p>
        <p><span>{tooltip.close > tooltip.open ? "": "-"}{percentage_change(tooltip.high, tooltip.low).toFixed(2)}%</span> </p>
        <p><span className={styles.light}>C:</span><span>{tooltip.close}</span> </p>
        <p><span className={styles.light}>O:</span><span>{tooltip.open}</span> </p>
        <p><span className={styles.light}>H:</span><span>{tooltip.high}</span> </p>
        <p><span className={styles.light}>L:</span><span>{tooltip.low}</span> </p>
        <span className={styles.ema100}>EMA100:{tooltip.ema100ref?.toFixed(4)}</span> 
        <span className={styles.ema200}>EMA200:{tooltip.ema200ref?.toFixed(4)}</span> 
        <span className={styles.vwap}>VWAP:{tooltip.vwap?.toFixed(4)}</span>
      </div>
      </div>
      <div ref={containerRef} style={{ width, height }} />
    </div>
  );
};

export default Candlestick;