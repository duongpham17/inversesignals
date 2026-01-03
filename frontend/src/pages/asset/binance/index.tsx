import { useContext, useState, useEffect } from 'react';
import { Context } from '../UseContext';
import { useLocation } from 'react-router-dom';
import { composite_volatility, escalation, percentage_from_high, roi } from '@utils/forumlas';
import { klines as BinanceKlines, TBinanceKlines } from 'exchanges/binance';

import AreaChart from '@charts/Area';
import EmaVwapChart from '@charts/EmaVwap';
import CandlestickChartEma from '@charts/Apexcharts';
import Group from '@components/groups/Double';
import Text from '@components/texts/Style2';

const Binance = () => {

  const [location] = [useLocation()];

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

  const style ={
    candleStickHeightChart: 250,
    height: 150,
    size: 20
  };

  return (
    <>
      {viewChart === "candle" && <CandlestickChartEma data={klines} height={400} plain />}

      {viewChart === "ema" && <EmaVwapChart data={klines} height={400} sync="crypto" />}

      <Group>
        <div>
          <Text size={style.size}>Composite Volatility</Text>
          <AreaChart data={composite_volatility(klines)} xkey='date' ykey='volatility' height={style.height} sync="crypto" />
        </div>
        <div>
          <Text size={style.size}>Escalation</Text>
          <AreaChart data={escalation(klines)} xkey='date' ykey='escalation' height={style.height} sync="crypto" />
        </div>
      </Group>

      <Group>
        <div>
            <Text size={style.size}>Accumulated Roi</Text>
            <AreaChart data={roi(klines)} xkey='date' ykey='roi' height={style.height} sync="crypto" />
          </div>
        <div>
          <Text size={style.size}>Percentage From High</Text>
          <AreaChart data={percentage_from_high(klines)} xkey="date" ykey="pchigh" height={style.height} sync="crypto" />
        </div>
      </Group>
    </>
  );
};

export default Binance;