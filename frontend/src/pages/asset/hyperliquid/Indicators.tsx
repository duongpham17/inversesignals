import { composite_volatility, escalation, percentage_from_high, roi } from '@utils/forumlas';
import { THyperliquidKlines } from 'exchanges/hyperliquid';
import AreaChart from '@charts/Area';
import Group from '@components/groups/Double';
import Text from '@components/texts/Style2';

interface Props {
  candles: THyperliquidKlines, 
}

const Charts = ({candles}: Props) => {

  const style ={
    candleStickHeightChart: 250,
    height: 170,
    size: 20
  };
  
  return (
    <>

        <Group>
          <div>
            <Text size={style.size}>Composite Volatility</Text>
            <AreaChart data={composite_volatility(candles)} xkey='date' ykey='volatility' height={style.height} sync="crypto" />
          </div>
          <div>
            <Text size={style.size}>Percentage From High</Text>
            <AreaChart data={percentage_from_high(candles)} xkey="date" ykey="pchigh" height={style.height} sync="crypto" />
          </div>
        </Group>

        <Group>
          <div>
            <Text size={style.size}>Accumulated Roi</Text>
            <AreaChart data={roi(candles)} xkey='date' ykey='roi' height={style.height} sync="crypto" />
          </div>
          <div>
            <Text size={style.size}>Escalation</Text>
            <AreaChart data={escalation(candles)} xkey='date' ykey='escalation' height={style.height} sync="crypto" />
          </div>
        </Group>

    </>
  );
};

export default Charts;