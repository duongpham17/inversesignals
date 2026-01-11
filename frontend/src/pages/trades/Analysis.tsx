import React, { useMemo, useCallback } from 'react';
import { useAppSelector } from '@redux/hooks/useRedux';
import { ITrades } from '@redux/types/trades';
import { calculate_trade_metrics } from '@utils/forumlas';
import BarChart from '@charts/Bar';
import Text from '@components/texts/Style2';
import Loader from '@components/loaders/Style1';
import Container from '@components/containers/Style3';

const Analysis = () => {

  const { trades } = useAppSelector(state => state.trades);

  const analysis = useCallback((completed: typeof trades, key: keyof ITrades) => {
    const index = Object.values(completed!.reduce<Record<number, {x: number, profit: number, loss:number, long: number, short: number, roi: number, pnl: number}>>((acc, el) => {
      const x = (Number(el[key]));
      const metrics = calculate_trade_metrics(el.close_klines[1],el.open_klines[1],el.side,el.size,el.leverage);
      if (!acc[x]) acc[x] = { x, profit: 0, loss: 0, long: 0, short: 0, roi: 0, pnl: 0 };
      metrics.pnl > 0 ? acc[x].profit++ : acc[x].loss++;
      el.side === "long" ? acc[x].long++ : acc[x].short++;
      acc[x].roi += (metrics.roi * el.leverage);
      acc[x].pnl += metrics.pnl;
      return acc;
      }, {})
    );
    return index
  }, []);

  const data = useMemo(() => {
    if(!trades) return null;
    const completed = trades.filter(el => el.close_klines.length);

    const leverage_index = analysis(completed, "leverage");
    const limits_index = analysis(completed, "x_limits");
    const rsi_index = analysis(completed, "x_rsi");
    const pc_index = analysis(completed, "x_pchigh");
    const composite_v_index = analysis(completed, "x_composite_volatility");
    const streaks_index = analysis(completed, "x_streaks");
    const escalation_index = analysis(completed, "x_escalation");
    const candle_index = analysis(completed, "x_candle_roi");

    return [
      {name: "rsi", dataset: rsi_index},
      {name: "pc high", dataset: pc_index},
      {name: "composite volatility", dataset: composite_v_index},
      {name: "streaks", dataset: streaks_index},
      {name: "escalation", dataset: escalation_index},
      {name: "candle", dataset: candle_index},
      {name: "leverage", dataset: leverage_index},
      {name: "limits", dataset: limits_index},
    ]

  }, [trades, analysis]);

  const style = {
    height: 200
  }

  if(!data) return <Loader />

  return (
    <div>
      {data.map(el =>
        <Container key={el.name}>
          <Text>{el.name.toUpperCase()} [ {el.dataset.length} ]</Text>
          <BarChart data={el.dataset} xkey='x' ykey='profit' zkey='loss' analysis={true} height={style.height} />
        </Container>
      )}
    </div>
  )

}

export default Analysis