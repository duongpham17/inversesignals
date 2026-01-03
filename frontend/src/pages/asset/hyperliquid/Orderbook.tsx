import styles from './Orderbook.module.scss';
import { useContext, useEffect, useState, useRef } from 'react';
import { Context } from '../UseContext';
import { formatNumbersToString } from '@utils/functions';
import { useHyperliquidOrderBook } from 'exchanges/hyperliquid';
import AreaChart from '@charts/Area';
import Between from '@components/flex/Between';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style2';;

const Orderbook = () => {

  const { symbol, limits } = useContext(Context);
  
  const { buys, sells } = useHyperliquidOrderBook(symbol!);

  const [ total, setTotal ] = useState(0);

  const [ tracker, setTracker ] = useState<{date: Number, total: number}[]>([]);

  const prevDepth = useRef({ buys: 0, sells: 0 });

  useEffect(() => {
    const buyDepth = buys.reduce((a, b) => a + b.size, 0);
    const sellDepth = sells.reduce((a, b) => a + b.size, 0);

    const delta =
      (buyDepth - prevDepth.current.buys) -
      (sellDepth - prevDepth.current.sells);

    prevDepth.current = { buys: buyDepth, sells: sellDepth };

    setTotal(prevTotal => {
      const nextTotal = prevTotal + delta;
      setTracker(prev => [...prev, { date: Date.now(), total: nextTotal }].slice(-limits));
      return nextTotal;
    });
  }, [buys, sells, limits]);

  const reset = () => {
    setTracker([]);
  };

  return (
    <div className={styles.orderbook}>

      <div className={styles.stats}>
        <Between>
          <Button onClick={reset}><Text size={18}>OrderBook [ {tracker.length} ]</Text></Button>
          <Text size={18} color={total>0?"green":"red"}>{formatNumbersToString(total)}</Text>
        </Between>
      </div>

      <div className={styles.book}>
        <div>
          <Text size={20} color="green">{formatNumbersToString(buys.reduce((acc, cur) => acc + cur.size, 0))}</Text>
          {buys.slice(0, 10).map(el => <Text key={el.price} color="green">{el.price} {el.size}</Text>)}
        </div>
        <div>
          <Text size={20} color="red">{formatNumbersToString(sells.reduce((acc, cur) => acc + cur.size, 0))}</Text>
          {sells.slice(0, 10).map(el => <Text key={el.price} color="red">{el.price} {el.size}</Text>)}
        </div>
      </div>

      <div className={styles.chart}>
        <AreaChart data={tracker} xkey='date' ykey='total' height={200}/>
      </div>
    </div>
  ) 
}

export default Orderbook