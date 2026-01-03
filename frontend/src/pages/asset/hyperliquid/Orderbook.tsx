import { useContext, useEffect, useState, useRef } from 'react';
import { Context } from '../UseContext';
import { formatNumbersToString } from '@utils/functions';
import { useHyperliquidOrderBook } from 'exchanges/hyperliquid';
import AreaChart from '@charts/Area';
import Text from '@components/texts/Style2';
import Container from '@components/containers/Style3';

const Orderbook = () => {
  const { symbol, limits } = useContext(Context);
  const { buys, sells } = useHyperliquidOrderBook(symbol!);

  const [ total, setTotal ] = useState(0);
  const [ tracker, setTracker ] = useState<{date: number, total: number}[]>([]);
  
  const prevDepth = useRef({ buys: 0, sells: 0 });
  const trackerRef = useRef<{date: number, total: number}[]>([]); // avoid heavy re-renders
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const buyDepth = buys.reduce((a, b) => a + b.size, 0);
    const sellDepth = sells.reduce((a, b) => a + b.size, 0);

    const delta =
      (buyDepth - prevDepth.current.buys) -
      (sellDepth - prevDepth.current.sells);

    prevDepth.current = { buys: buyDepth, sells: sellDepth };

    setTotal(prevTotal => {
      const nextTotal = prevTotal + delta;

      // Throttle updates to tracker
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
      updateTimeout.current = setTimeout(() => {
        trackerRef.current = [...trackerRef.current, { date: Date.now(), total: nextTotal }].slice(-limits);
        setTracker(trackerRef.current);
      }, 500); // update every 100ms

      return nextTotal;
    });
  }, [buys, sells, limits]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
    };
  }, []);

  return (
    <Container>
      <Text color={total > 0 ? "green" : "red"}>Orderbook Depth [ {tracker.length} ] {formatNumbersToString(total)}</Text>
      <AreaChart data={tracker} xkey='date' ykey='total' height={170}/>
    </Container>
  );
}

export default Orderbook;