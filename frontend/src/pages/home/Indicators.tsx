import { useMemo, useContext, useState } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { Link } from 'react-router-dom';
import { rsi, roi, percentage_from_high, composite_volatility, escalation } from '@utils/forumlas';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Container from '@components/containers/Style3';
import TextIndex from '@components/texts/Style2';
import Text from '@components/texts/Style1';
import Between from '@components/flex/Between';
import Wrap from '@components/flex/Wrap';
import Button from '@components/buttons/Style1';

const Pchigh = () => {

  const {assets} = useAppSelector(state => state.assets);

  const {datasetTimeseries} = useContext(Context);

  const indicators = ["rsi", "roi", "pchigh", "escalation", "cvolatility"] as const;
  type TSortIndicator = typeof indicators[number];

  const [sort, setSort] = useState<{ indicator: TSortIndicator, direction: 1 | -1 }>({indicator: "rsi", direction: -1});

  const data = useMemo(() => {
    if (!assets) return null;

    return assets.map(x => {
      const ts = x[datasetTimeseries()];
      return {
        ticker: x.ticker,
        rsi: sort.indicator === "rsi" ? Number(rsi(ts).slice(-1)[0].rsi.toFixed(0)) : 0,
        roi: sort.indicator === "roi" ? Number(roi(ts).slice(-1)[0].roi.toFixed(2)) : 0,
        pchigh: sort.indicator === "pchigh" ? Number(percentage_from_high(ts).slice(-1)[0].pchigh.toFixed(0)) : 0,
        cvolatility: sort.indicator === "cvolatility" ? Number(composite_volatility(ts).slice(-1)[0].volatility.toFixed(0)) : 0,
        escalation: sort.indicator === "escalation" ? Number(escalation(ts).slice(-1)[0].escalation.toFixed(0)) : 0,
      };
    });
  }, [assets, datasetTimeseries, sort]);

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
    name: "60px",
    width: "100px"
  };

  return (
    <>

      <Wrap>
        {indicators.map(el => 
          <Button key={el} onClick={() => onSort(el)} color={el===sort.indicator?"primary":"default"}>
            <Text>{el.toUpperCase()}</Text>
            <Text> {sort.indicator === el && sort.direction === -1 ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown/>}</Text>
          </Button>
        )}
      </Wrap>
      <>
        {data_sorted?.map(el =>
          <Container key={el.ticker}>
            <Between>
              <Link to={`/asset?symbol=${el.ticker}`}><Text style={{width: styles.name}}>{el.ticker}</Text></Link>
              {sort.indicator === "rsi" &&<TextIndex style={{width: styles.width}} color={el.rsi > 75 ? "green" : el.rsi < 25 ? "red" : "default"}>{el.rsi}</TextIndex>}
              {sort.indicator === "roi" && <TextIndex style={{width: styles.width}} color={el.roi > 0 ? "green" : "red"}>{el.roi}</TextIndex>}
              {sort.indicator === "pchigh" && <TextIndex style={{width: styles.width}} color={el.pchigh > 75 ? "green" : el.pchigh < 25 ? "red" : "default"}>{el.pchigh}</TextIndex>}
              {sort.indicator === "escalation" && <TextIndex style={{width: styles.width}} color={el.escalation > 0 ? "green" : "red"}>{el.escalation}</TextIndex>}
              {sort.indicator === "cvolatility" && <TextIndex style={{width: styles.width}}>{el.cvolatility}</TextIndex>}
            </Between>
          </Container>
        )}
      </>
    </>
  )
}

export default Pchigh