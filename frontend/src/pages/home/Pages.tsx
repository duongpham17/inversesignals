import { useContext } from 'react';
import { Context } from './UseContext';
import Page from '@components/pages/Style1';
import Controller from './Controller';
import Assets from './Assets';
import Grouped from './Grouped';
import ArrowsHeatmap from './ArrowsHeatmap';
import CandlePatterns from './CandlePatterns';
import Indicies from './Indices';

const HomePage = () => {
  
  const {page} = useContext(Context);

  return (
    <Page>
      <Controller />
      <br/>
      {(page === 1 || !page) &&  <Assets />}
      {page === 2 && <Grouped />}
      {page === 3 && <ArrowsHeatmap />}
      {page === 4 && <CandlePatterns />}
      {page === 5 && <Indicies />}
    </Page>
  )
}

export default HomePage;