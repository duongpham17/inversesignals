import { composite_volatility, escalation, percentage_from_high, volume, rsi } from '@utils/forumlas';
import { TBinanceKlines } from 'exchanges/binance';
import AreaChart from '@charts/Area';
import Text from '@components/texts/Style2';
import Container from '@components/containers/Style3';

interface Props {
  klines: TBinanceKlines
}

const Indicators = ({klines}: Props) => {

  const style ={
    candleStickHeightChart: 250,
    height: 150,
    size: 20
  };

  return (
    <>
    <Container>
      <Text color="light">Volume</Text>
      <AreaChart data={volume(klines)} xkey='date' ykey='volume' height={style.height} sync="crypto" />
    </Container>

    <Container>
      <Text color="light">Rsi</Text>
      <AreaChart data={rsi(klines)} xkey='date' ykey='rsi' height={style.height} sync="crypto" />
    </Container>

    <Container>
      <Text color="light">Composite Volatility</Text>
      <AreaChart data={composite_volatility(klines)} xkey='date' ykey='volatility' height={style.height} sync="crypto" />
    </Container>

    <Container>
      <Text color="light">Percentage From High</Text>
      <AreaChart data={percentage_from_high(klines)} xkey="date" ykey="pchigh" height={style.height} sync="crypto" />
    </Container>

    <Container>
      <Text color="light">Escalation</Text>
      <AreaChart data={escalation(klines)} xkey='date' ykey='escalation' height={style.height} sync="crypto" />
    </Container>
    </>
  );
};

export default Indicators;