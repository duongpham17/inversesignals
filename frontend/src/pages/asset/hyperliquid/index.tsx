import { useContext, useEffect, useMemo, useState } from 'react';
import { Context } from '../UseContext';
import { useHyperliquidKlines } from 'exchanges/hyperliquid';
import { useAppSelector } from '@redux/hooks/useRedux';
import { priceFormat } from '@utils/functions';
import Flex from '@components/flex/Flex'
import Loader from '@components/loaders/Style1';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style1';
import Container from '@components/containers/Style3';
import EmaVwapChart from '@charts/EmaVwap';
import Candlesticks from '@charts/Candlesticks';
import Orderbook from './Orderbook';
import Trade from './Trades';
import Indicators from './Indicators';

const Hyperliquid = () => {

  const { timeseries, limits, symbol, setPrice, viewChart, openItem } = useContext(Context);
  
  const { open } = useAppSelector(state => state.trades);
  
  const [ options, setOptions ] = useState("orderbook");

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
    return open.filter(el => el.ticker === symbol).map(el => ({
      open: el.open_klines[1],
      size: el.size,
      side: el.side,
      leverage: el.leverage
    }))
  }, [open, symbol]);

  if(!candles.length) return <Loader />

  return (
    <>

      {viewChart === "candle" && <Candlesticks data={candles} height={400} annotations={annotations} precision={priceFormat(candles[0][1]).precision} minMove={priceFormat(candles[0][1]).minMove}/>}

      {viewChart === "line" && <EmaVwapChart data={candles} height={400} sync="crypto"/>}

      {candles.length && <Trade candles={candles}/>}

      {openItem !== "record" && 
      <>
        <Container>
          <Flex>
            <Button onClick={() => setOptions("orderbook")}><Text color={options==="orderbook" ? "primary" : "default"}>Orderbook</Text></Button>
            <Button onClick={() => setOptions("indicators")}><Text color={options==="indicators" ? "primary" : "default"}>Indicators</Text></Button>
          </Flex>
        </Container>

        {options === "orderbook" && <Orderbook/>}

        {options === "indicators" && <Indicators candles={candles}/>}
      </>
      }

    </>
  );
};

export default Hyperliquid;