import { useContext, useEffect } from 'react';
import { Context } from '../UseContext';
import { useBinanceKlines } from 'exchanges/binance';
import { priceFormat } from '@utils/functions';
import EmaVwapChart from '@charts/EmaVwap';
import CandlestickChart from '@charts/Candlesticks';
import Indicators from './Indicators';

const Binance = () => {

  const { symbol, timeseries, limits, setPrice, viewChart } = useContext(Context);

  const candles = useBinanceKlines(symbol!,timeseries,limits);

  useEffect(() => {
    if (!candles || candles.length === 0) return;
  
    const lastCandle = candles[candles.length - 1];
    if (lastCandle) {
      setPrice(lastCandle[1]);
    }
  }, [candles, setPrice]);

  return (
    <>
      {viewChart === "candle" && candles.length > 0 && (
        <CandlestickChart
          data={candles}
          height={300}
          precision={priceFormat(candles[0][1]).precision}
          minMove={priceFormat(candles[0][1]).minMove}
        />
      )}

      {viewChart === "line" && candles.length > 0 && (
        <EmaVwapChart
          data={candles}
          height={300}
          sync="crypto"
        />
      )}

      <Indicators klines={candles} />
    </>
  );
};

export default Binance;