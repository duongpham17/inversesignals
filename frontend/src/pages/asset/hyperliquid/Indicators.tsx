import { composite_volatility, escalation, percentage_from_high, volume, rsi } from '@utils/forumlas';
import { THyperliquidKlines } from 'exchanges/hyperliquid';
import AreaChart from '@charts/Area';
import Text from '@components/texts/Style2';
import Container from '@components/containers/Style3';

interface Props {
  candles: THyperliquidKlines, 
}

const Charts = ({candles}: Props) => {

  const style ={
    candleStickHeightChart: 250,
    height: 170,
  };
  
  return (
    <>

    <Container>
      <Text color="light">Volume</Text>
      <AreaChart data={volume(candles)} xkey='date' ykey='volume' height={style.height} sync="crypto" />
    </Container>

    <Container>
      <Text color="light">Rsi</Text>
      <AreaChart data={rsi(candles)} xkey='date' ykey='rsi' height={style.height} sync="crypto" />
    </Container>

    <Container>
      <Text color="light">Composite Volatility</Text>
      <AreaChart data={composite_volatility(candles)} xkey='date' ykey='volatility' height={style.height} sync="crypto" />
    </Container>

    <Container>
      <Text color="light">Percentage From High</Text>
      <AreaChart data={percentage_from_high(candles)} xkey="date" ykey="pchigh" height={style.height} sync="crypto" />
    </Container>

    <Container>
      <Text color="light">Escalation</Text>
      <AreaChart data={escalation(candles)} xkey='date' ykey='escalation' height={style.height} sync="crypto" />
    </Container>

    </>
  );
};

export default Charts;