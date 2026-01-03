import { composite_volatility, escalation, percentage_from_high } from '@utils/forumlas';
import { TBinanceKlines } from 'exchanges/binance';
import AreaChart from '@charts/Area';
import Text from '@components/texts/Style2';

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
      <Text color="light" size={style.size}>Composite Volatility</Text>
      <AreaChart data={composite_volatility(klines)} xkey='date' ykey='volatility' height={style.height} sync="crypto" />

      <Text color="light" size={style.size}>Escalation</Text>
      <AreaChart data={escalation(klines)} xkey='date' ykey='escalation' height={style.height} sync="crypto" />

      <Text color="light" size={style.size}>Percentage From High</Text>
      <AreaChart data={percentage_from_high(klines)} xkey="date" ykey="pchigh" height={style.height} sync="crypto" />
    </>
  );
};

export default Indicators;