import { useContext } from 'react';
import { Context } from './UseContext';
import Page from '@components/pages/Style1';
import Line from '@components/line/Style1';
import Controller from './Controller';
import Assets from './Assets';
import Grouped from './Grouped';
import ArrowsHeatmap from './ArrowsHeatmap';
import CandlePatterns from './CandlePatterns';
import Indicies from './Indices';
import Streaks from './Streaks';

const HomePage = () => {
  
  const {page} = useContext(Context);

  return (
    <Page>
      <Controller />
      <Line color="primary" />
      {(page === 1 || !page) &&  <Assets/>}
      {page === 2 && <Grouped/>}
      {page === 3 && <ArrowsHeatmap/>}
      {page === 4 && <Streaks/>}
      {page === 5 && <CandlePatterns/>}
      {page === 6 && <Indicies/>}
    </Page>
  )
}

export default HomePage;