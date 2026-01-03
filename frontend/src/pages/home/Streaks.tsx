import { useMemo, useContext, useState } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { IAssets } from '@redux/types/assets';
import { Link } from 'react-router-dom';
import Loader from '@components/loaders/Style1';
import Wrap from '@components/flex/Wrap';
import Container from '@components/containers/Style3';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style1';

interface Props {
  assets: IAssets[]
};
const Streaks = ({assets}: Props) => {

  const {datasetTimeseries, timeseries} = useContext(Context);

  const [limit, setLimit] = useState(4);

  const limit_set = [2, 3, 4, 5, 6, 7, 8, 9, 10]

  const data = useMemo(() => {
    return assets.reduce<{name: string, ticker: string, streak: number}[]>((acc, asset) => {
      const series = asset[datasetTimeseries()]?.slice(-30) || [];
      let streak = 0;

      for (const x of series) {
        const close = x[1];
        const open = x[3];

        if (close > open) {
          streak = streak < 0 ? 1 : streak + 1;
        } else if (close < open) {
          streak = streak > 0 ? -1 : streak - 1;
        } else {
          streak = 0; // no change
        }
      }

      if (streak >= limit || streak <= -limit) acc.push({name: asset.name, ticker: asset.ticker, streak});

      return acc.sort((a,b) => a.streak - b.streak);
    }, []);
  }, [assets, datasetTimeseries, limit]);

  return (
    <>
      <Wrap>
        <Text>Streak Limit</Text>
        {limit_set.map(el => <Button color={limit===el?"primary":"dark"} key={el} onClick={() => setLimit(el)}>{el}</Button>)}
      </Wrap> 

      {data.map(el => 
        <Container key={el.name} color={el.streak > 0 ? "green" : "red"}>
          <Link to={`/asset?id=${el.name}&symbol=${el.ticker}&timeseries=${timeseries}`}>
            <Text color={el.streak > 0 ? "green" : "red"} size={20}>{el.streak} {el.name.toUpperCase()}</Text>
          </Link>
        </Container>
      )}
    </>
  )
};

const StreaksMain = () => {

  const {assets} = useAppSelector(state => state.assets);

  if(!assets) return <Loader/>

  return (
    <Streaks assets={assets}/>
  )
}

export default StreaksMain