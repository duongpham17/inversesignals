import { useMemo, useContext, useState } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { IAssets } from '@redux/types/assets';
import { Link } from 'react-router-dom';
import Loader from '@components/loaders/Style1';
import Wrap from '@components/flex/Wrap';
import Flex from '@components/flex/Flex';
import Container from '@components/containers/Style3';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style1';
import Options from '@components/options/Style1';

interface Props {
  assets: IAssets[]
};
const Streaks = ({assets}: Props) => {

  const {datasetTimeseries, timeseries} = useContext(Context);

  const [dataset, setDataset] = useState(20);
  const [limit, setLimit] = useState(4);
  const [view, setView] = useState(false);

  const limit_set = [2, 3, 4, 5, 6, 7, 8, 9, 10];
  const dataset_set = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

  const data_streak_current = useMemo(() => {
    return assets.reduce<{name: string, ticker: string, streak: number}[]>((acc, asset) => {
      const series = asset[datasetTimeseries()]?.slice(-dataset - 1, -1) || [];
      let streak = 0;

      for (const x of series) {
        const [close, open] = [x[1], x[3]];
        if (close > open) {
          streak = streak < 0 ? 1 : streak + 1;
        } else if (close < open) {
          streak = streak > 0 ? -1 : streak - 1;
        } else {
          streak = 0; // no change
        }
      }

      if (streak >= limit || streak <= -limit) acc.push({name: asset.name, ticker: asset.ticker, streak});

      return acc
    }, []).sort((a,b) => a.streak - b.streak);
  }, [assets, datasetTimeseries, limit, dataset]);

  const data_streak_previous = useMemo(() => {
    return assets.reduce<{ name: string; ticker: string; streak: number }[]>((acc, asset) => {
      const series = asset[datasetTimeseries()]?.slice(-dataset - 1, -1) || [];
      let streak = 0;
      const completedStreaks: number[] = [];

      for (const x of series) {
        const [close, open] = [x[1], x[3]];

        // Update streak
        if (close > open) {
          streak = streak < 0 ? 1 : streak + 1;
        } else if (close < open) {
          streak = streak > 0 ? -1 : streak - 1;
        } else {
          streak = 0; // tie resets streak
        }

        // Check if streak reaches limit
        if (Math.abs(streak) >= limit) {
          completedStreaks.push(streak);
        }

        // If streak reverses past zero, reset for next detection
        if ((streak > 0 && close < open) || (streak < 0 && close > open)) {
          streak = 0;
        }
      }

      // Add completed streaks to accumulator
      for (const s of completedStreaks) {
        acc.push({ name: asset.name, ticker: asset.ticker, streak: s });
      }

      return acc;
    }, [])
    .sort((a, b) => b.streak - a.streak)
    .filter(el => el.streak >= limit || el.streak <= -limit) // sort descending streak
    .filter((item, index, self) => index === self.findIndex( (t) => t.name === item.name && t.streak === item.streak)
  );
  }, [assets, datasetTimeseries, limit, dataset]);

  const streakDataToRender = view ? data_streak_previous : data_streak_current;

  return (
    <>
      <Wrap>
        <Flex>
          <Button color="dark" onClick={() => setView(!view)}>{view ? "Previous" : "Current"}</Button>
          <Options color="dark" options={dataset_set.map(el => el.toString())} value={dataset.toString()} onClick={(v) => setDataset(Number(v))} />
          {limit_set.map(el => <Button color={limit===el?"primary":"dark"} key={el} onClick={() => setLimit(el)}>{el}</Button>)}
        </Flex>
      </Wrap> 

      {streakDataToRender.map((el, index) => (
        <Container
          key={el.name + el.streak + index} // safe unique key
          color={el.streak > 0 ? "green" : "red"}
        >
          <Link to={`/asset?id=${el.name}&symbol=${el.ticker}&timeseries=${timeseries}`}>
            <Text color={el.streak > 0 ? "green" : "red"} size={20}>
              {el.streak} {el.name.toUpperCase()}
            </Text>
          </Link>
        </Container>
      ))}
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