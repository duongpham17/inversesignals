import { useContext, useState, useEffect } from 'react';
import { Context } from '../UseContext';
import { useLocation } from 'react-router-dom';
import { klines as BinanceKlines, TBinanceKlines } from 'exchanges/binance';
import EmaVwapChart from '@charts/EmaVwap';
import CandlestickChartEma from '@charts/Apexcharts';
import Indicators from './Indicators';

const Binance = () => {

  const [ location ] = [useLocation()];

  const { symbol, timeseries, limits, setPrice, viewChart } = useContext(Context);

  const [ klines, setKlines ] = useState<TBinanceKlines>([]);

  useEffect(() => {
    if(!symbol) return;
    let cancelled = false;
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      if (cancelled) return;
      await fetchKlines();
      timeoutId = setTimeout(poll, 5000);
    };

    const fetchKlines = async () => {
      const klines = await BinanceKlines(symbol, timeseries);
      if (!cancelled) {
        setKlines(klines.slice(-limits));
        setPrice(klines[klines.length - 1][1]);
      }
    };

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [location.search, limits, timeseries, setPrice, symbol]);

  return (
    <>
      {viewChart === "candle" && <CandlestickChartEma data={klines} height={400} plain />}

      {viewChart === "line" && <EmaVwapChart data={klines} height={400} sync="crypto" />}

      <Indicators klines={klines}/>
    </>
  );
};

export default Binance;