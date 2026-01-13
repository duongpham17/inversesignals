import { useContext, useMemo, useEffect, useState } from 'react';
import { Context } from '../UseContext';
import { formatNumbersToString } from '@utils/functions';
import { useHyperliquidOrderBook } from 'exchanges/hyperliquid';
import BarChart from '@charts/Bar';
import Text from '@components/texts/Style2';
import Container from '@components/containers/Style3';
import Flex from '@components/flex/Flex';
import Hover from '@components/hover/Style1';

const Orderbook = () => {

  const { symbol } = useContext(Context);
  const { buys, sells } = useHyperliquidOrderBook(symbol!);
  const [ orderbook, setOrderbook ] = useState<{date: number, buy: number, sell: number}[]>([]);
  
  const data = useMemo(() => {
    const buy_total = buys.reduce((acc, cur) => acc + (cur.price * cur.size), 0);
    const sell_total = sells.reduce((acc, cur) => acc + (cur.price * cur.size), 0);
    return {
      total: buy_total+sell_total,
      sells: sell_total,
      buys: buy_total
    }
  }, [buys, sells]);

  useEffect(() => {
    const date = Date.now();
    const buys_total = buys.reduce((acc, cur) => acc + (cur.price * cur.size), 0);
    const sell_total = sells.reduce((acc, cur) => acc + (cur.price * cur.size), 0);
    const orders = {date, buy: buys_total, sell: sell_total}
    setOrderbook(state => state.length ? [...state, orders].slice(-100) : [orders] )
  }, [buys, sells]);

  return (
    <Container>
      <Flex>
        <Text>Orderbook Depth</Text>
        <Hover message='Open Interest'><Text>${formatNumbersToString(data.total)} </Text></Hover>
        <Hover message='Buys'><Text color={"green"}>${formatNumbersToString(data.buys)} </Text></Hover>
        <Hover message='Sells'><Text color={"red"}>${formatNumbersToString(data.sells)} </Text></Hover>
      </Flex>
      <BarChart data={orderbook} xkey='date' ykey="buy" zkey='sell' analysis height={200} />
    </Container>
  );
}

export default Orderbook;