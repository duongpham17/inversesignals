import { useMemo, useContext, useState } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { Link } from 'react-router-dom';
import { rsi, roi, percentage_from_high, composite_volatility, escalation } from '@utils/forumlas';
import ContainerGrid from '@components/containers/Style1';
import Text from '@components/texts/Style2';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

const Pchigh = () => {

  const {assets} = useAppSelector(state => state.assets);

  const {datasetTimeseries} = useContext(Context);

  const indicators = ["rsi", "roi", "pchigh", "esc", "cvol"] as const;
  type TSortIndicator = typeof indicators[number];

  const [sort, setSort] = useState<{ indicator: TSortIndicator, direction: 1 | -1 }>({indicator: "rsi", direction: -1});

  const data = useMemo(() => {
    if (!assets) return null;

    return assets.map(x => {
      const ts = x[datasetTimeseries()];
      return {
        ticker: x.ticker,
        rsi: Number(rsi(ts).slice(-1)[0].rsi.toFixed(0)),
        roi: Number(roi(ts).slice(-1)[0].roi.toFixed(2)),
        pchigh: Number(percentage_from_high(ts).slice(-1)[0].pchigh.toFixed(0)),
        cvol: Number(composite_volatility(ts).slice(-1)[0].volatility.toFixed(0)),
        esc: Number(escalation(ts).slice(-1)[0].escalation.toFixed(0)),
      };
    });
  }, [assets, datasetTimeseries]);

  const data_sorted = useMemo(() => {
    if (!data) return null;
    return [...data].sort( (a, b) => (a[sort.indicator] - b[sort.indicator]) * sort.direction);
  }, [data, sort]);

  const onSort = (indicator: TSortIndicator) => {
    setSort(state => ({
      indicator,
      direction: state.indicator === indicator ? (state.direction === 1 ? -1 : 1) : -1
    }));
  };
    
  const styles = {
    width: "100px"
  };

  return (
    <>
      <ContainerGrid>
        <Between>
          <Text style={{width: styles.width}}>Name</Text>
          {indicators.map(el => 
            <Flex key={el}>
              <Text onClick={() => onSort(el)} style={{width: styles.width}}>
                {el.toUpperCase()}  {sort.indicator === el && sort.direction === -1 ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown/>}
              </Text>
            </Flex>
          )}
        </Between>
      </ContainerGrid>
      <>
        {data_sorted?.map(el =>
          <ContainerGrid key={el.ticker}>
            <Between>
              <Link to={`/asset?symbol=${el.ticker}`}><Text style={{width: styles.width}}>{el.ticker}</Text></Link>
              <Text style={{width: styles.width}} color={el.rsi > 75 ? "green" : el.rsi < 25 ? "red" : "default"}>{el.rsi}</Text>
              <Text style={{width: styles.width}} color={el.roi > 0 ? "green" : "red"}>{el.roi}</Text>
              <Text style={{width: styles.width}} color={el.pchigh > 75 ? "green" : el.pchigh < 25 ? "red" : "default"}>{el.pchigh}</Text>
              <Text style={{width: styles.width}} color={el.esc > 0 ? "green" : "red"}>{el.esc}</Text>
              <Text style={{width: styles.width}}>{el.cvol}</Text>
            </Between>
          </ContainerGrid>
        )}
      </>
    </>
  )
}

export default Pchigh