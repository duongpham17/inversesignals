import { composite_volatility, escalation, percentage_from_high } from '@utils/forumlas';
import { THyperliquidKlines } from 'exchanges/hyperliquid';
import AreaChart from '@charts/Area';
import Text from '@components/texts/Style2';

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

    <Text>Composite Volatility</Text>
    <AreaChart data={composite_volatility(candles)} xkey='date' ykey='volatility' height={style.height} sync="crypto" />

    <Text>Percentage From High</Text>
    <AreaChart data={percentage_from_high(candles)} xkey="date" ykey="pchigh" height={style.height} sync="crypto" />

    <Text>Escalation</Text>
    <AreaChart data={escalation(candles)} xkey='date' ykey='escalation' height={style.height} sync="crypto" />

    </>
  );
};

export default Charts;