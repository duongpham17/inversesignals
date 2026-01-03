import { useContext, useEffect, useState, useRef } from 'react';
import { Context } from '../UseContext';
import { formatNumbersToString } from '@utils/functions';
import { useHyperliquidOrderBook } from 'exchanges/hyperliquid';
import OrderbookChart from '@charts/Orderbook';
import Text from '@components/texts/Style2';
import Container from '@components/containers/Style3';
import Flex from '@components/flex/Flex';

const Orderbook = () => {

  const { price, symbol, limits } = useContext(Context);
  const { buys, sells } = useHyperliquidOrderBook(symbol!);
  const [ total, setTotal ] = useState(0);
  const prevDepth = useRef({ buys: 0, sells: 0 });

  useEffect(() => {
    const buyDepth = buys.reduce((a, b) => a + b.size, 0);
    const sellDepth = sells.reduce((a, b) => a + b.size, 0);
    const delta = (buyDepth - prevDepth.current.buys) - (sellDepth - prevDepth.current.sells);
    prevDepth.current = { buys: buyDepth, sells: sellDepth };
    setTotal(prevTotal => prevTotal + delta);
  }, [buys, sells, limits]);

  return (
    <Container>
      <Flex>
        <Text>Orderbook Depth</Text>
        <Text color={total > 0 ? "green" : "red"}>{formatNumbersToString(total)} </Text>
      </Flex>
      <OrderbookChart height={200} buys={buys} sells={sells} price={price} />
    </Container>
  );
}

export default Orderbook;