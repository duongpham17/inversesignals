import styles from './Volume.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import { createChart, HistogramSeries, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { formatDate, formatNumbersToString } from '@utils/functions';
import useWindowSize from '@hooks/useWindow';

type Props = {
  data: number[][]; // [[time(ms), close, volume, open, high, low], ...]
  height?: number;
};

const VolumeChart: React.FC<Props> = ({ data, height = 200 }) => {
  const { width } = useWindowSize();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const volumeRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [tooltip, setTooltip] = useState<{ time: number; volume: number }>({ time: 0, volume: 0 });

  // -----------------------------
  // Initialize Chart
  // -----------------------------
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    chartRef.current = createChart(container, {
      width: width >= 1200 ? 1200 : width - 40,
      height,
      layout: { background: { color: 'transparent' }, textColor: '#d1d4dc' },
      grid: { vertLines: { color: 'transparent' }, horzLines: { color: 'transparent' } },
      rightPriceScale: { borderColor: 'transparent' },
      timeScale: { borderColor: 'transparent' },
    });

    // Histogram series with centered zero line
    volumeRef.current = chartRef.current.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      base: 0, // ✅ zero line
    });

    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      chartRef.current?.timeScale().fitContent();
      chartRef.current?.priceScale('right').applyOptions({ autoScale: true });
    };

    container.addEventListener('contextmenu', handleRightClick);

    return () => {
      chartRef.current?.remove();
      container.removeEventListener('contextmenu', handleRightClick);
    };
  }, [height, width]);

  // -----------------------------
  // Set Volume Data
  // -----------------------------
  useEffect(() => {
    if (!volumeRef.current) return;

    volumeRef.current.setData(
      data.map(([time, close, volume, open]) => {
        const isUp = close >= open;
        return {
          time: Math.floor(time / 1000) as UTCTimestamp, // unix seconds
          value: isUp ? volume * close : -volume * close, // ✅ negative for red
          color: isUp ? '#22c55e' : '#ef4444',
        };
      })
    );
  }, [data]);

  // -----------------------------
  // Crosshair / Tooltip
  // -----------------------------
  useEffect(() => {
    if (!chartRef.current || !volumeRef.current) return;

    const handleHover = (param: any) => {
      if (!param.time) return;

      const point = param.seriesData.get(volumeRef.current);
      if (!point || !('value' in point)) return;

      setTooltip(prev => {
        const absValue = Math.abs(point.value);
        if (prev.time === param.time && prev.volume === absValue) return prev;
        return {
          time: param.time as number,
          volume: absValue, // show positive volume
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
      <div className={styles.tooltip}>
        <p className={styles.date}>{formatDate(tooltip.time * 1000)}</p>
        <p>{formatNumbersToString(tooltip.volume)}</p>
      </div>
      <div ref={containerRef} style={{ width, height }} />
    </div>
  );
};

export default VolumeChart;