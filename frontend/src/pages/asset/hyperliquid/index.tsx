import { useContext, useEffect, useState, useMemo } from 'react';
import { Context } from '../UseContext';
import { useHyperliquidKlines } from 'exchanges/hyperliquid';
import { useAppSelector } from '@redux/hooks/useRedux';

import EmaVwapChart from '@charts/EmaVwap';
import Candlesticks from '@charts/Candlesticks';
import Orderbook from './Orderbook';
import Trade from './Trades';
import Indicators from './Indicators';

const Hyperliquid = () => {

  const { timeseries, limits, symbol, setPrice, viewChart } = useContext(Context);
  
  const { trades } = useAppSelector(state => state.trades);

  const candles = useHyperliquidKlines(symbol!, timeseries, limits);

  const [recordTrade, setRecordTrade] = useState(false);

  useEffect(() => {
    if (!candles || candles.length === 0) return;

    const lastCandle = candles[candles.length - 1];
    if (lastCandle) {
      setPrice(lastCandle[1]);
    }
  }, [candles, setPrice]);

  const annotations = useMemo(() => {
    if(!trades) return [];
    return trades?.map(el => ({
      open: el.open_klines[1],
      size: el.size,
      side: el.side,
      leverage: el.leverage
    }))
  }, [trades]);

  return (
    <>

      {candles.length && <Trade candles={candles} recordTrade={recordTrade} setRecordTrade={setRecordTrade} />}

      {viewChart === "candle" && <Candlesticks data={candles} height={400} annotations={annotations} />}

      {viewChart === "ema" && <EmaVwapChart data={candles} height={400} sync="crypto" />}

      {!recordTrade && 
      <>
        <Orderbook  />

        <Indicators candles={candles} />
      </>
      }

    </>
  );
};

export default Hyperliquid;