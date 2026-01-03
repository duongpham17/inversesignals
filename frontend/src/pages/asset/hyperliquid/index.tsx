import { useContext, useEffect, useMemo } from 'react';
import { Context } from '../UseContext';
import { useHyperliquidKlines } from 'exchanges/hyperliquid';
import { useAppSelector } from '@redux/hooks/useRedux';
import { priceFormat } from '@utils/functions';

import Loader from '@components/loaders/Style1';
import EmaVwapChart from '@charts/EmaVwap';
import Candlesticks from '@charts/Candlesticks';
import Orderbook from './Orderbook';
import Trade from './Trades';
import Indicators from './Indicators';

const Hyperliquid = () => {

  const { timeseries, limits, symbol, setPrice, viewChart, openItem } = useContext(Context);
  
  const { open } = useAppSelector(state => state.trades);

  const candles = useHyperliquidKlines(symbol!, timeseries, limits);

  useEffect(() => {
    if (!candles || candles.length === 0) return;

    const lastCandle = candles[candles.length - 1];
    if (lastCandle) {
      setPrice(lastCandle[1]);
    }
  }, [candles, setPrice]);

  const annotations = useMemo(() => {
    if(!open) return [];
    return open?.map(el => ({
      open: el.open_klines[1],
      size: el.size,
      side: el.side,
      leverage: el.leverage
    }))
  }, [open]);

  if(!candles.length) return <Loader />

  return (
    <>

      {viewChart === "candle" && <Candlesticks data={candles} height={400} annotations={annotations} precision={priceFormat(candles[0][1]).precision} minMove={priceFormat(candles[0][1]).minMove}/>}

      {viewChart === "line" && <EmaVwapChart data={candles} height={400} sync="crypto" />}

      {candles.length && <Trade candles={candles} />}

      {openItem !== "record" && 
      <>
        <Orderbook  />

        <Indicators candles={candles} />
      </>
      }

    </>
  );
};

export default Hyperliquid;