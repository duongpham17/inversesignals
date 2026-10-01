import { useContext } from 'react';
import { Context } from './UseContext';
import Page from '@components/pages/Style1';
import Line from '@components/line/Style1';
import Controller from './Controller';
import Assets from './Assets';
import ArrowsHeatmap from './ArrowsHeatmap';
import CandlePatterns from './CandlePatterns';
import Indicies from './Indices';
import Streaks from './Streaks';
import Indicators from './Indicators';
import Momentum from './Momentum'

const HomePage = () => {
  
  const {page} = useContext(Context);

  return (
    <Page>
      <Controller />
      <Line color="primary" />
      {page === "assets" && <Assets/>}
      {page === "indicators" && <Indicators/>}
      {page === "arrows" && <ArrowsHeatmap/>}
      {page === "streaks" && <Streaks/>}
      {page === "candle" && <CandlePatterns/>}
      {page === "indicies" && <Indicies/>}
      {page === "momentum" && <Momentum/>}
    </Page>
  )
}

export default HomePage;