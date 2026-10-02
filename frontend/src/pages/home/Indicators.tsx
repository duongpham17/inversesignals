import { useMemo, useContext, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Context } from './UseContext';
import { rsi, roi, percentage_from_high, composite_volatility, escalation } from '@utils/forumlas';
import { formatDate } from '@utils/functions';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Container from '@components/containers/Style3';
import TextIndent from '@components/texts/Style2';
import Text from '@components/texts/Style1';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Wrap from '@components/flex/Wrap';
import Button from '@components/buttons/Style1';
import Hover from '@components/hover/Style1';

const Pchigh = () => {

  const {assets, datasetTimeseries, assetClass, customLinkUrl} = useContext(Context);

  const indicators = ["rsi", "roi", "pchigh", "escalation", "cvolatility"] as const;
  type TSortIndicator = typeof indicators[number];

  const [sort, setSort] = useState<{ indicator: TSortIndicator, direction: 1 | -1 }>({indicator: "rsi", direction: -1});

  const data = useMemo(() => {
    if (!assets) return null;
    return assets.filter(el => el.class === assetClass).map(x => {
      const ts = x[datasetTimeseries()];
      return {
        ticker: x.ticker,
        name: x.name,
        supply: x.supply,
        class: x.class,
        updatedAt: x.updatedAt,
        latest: ts.slice(-1)[0][1],
        rsi: sort.indicator === "rsi" ? Number(rsi(ts).slice(-1)[0].rsi.toFixed(0)) : 0,
        roi: sort.indicator === "roi" ? Number(roi(ts).slice(-1)[0].roi.toFixed(2)) : 0,
        pchigh: sort.indicator === "pchigh" ? Number(percentage_from_high(ts).slice(-1)[0].pchigh.toFixed(0)) : 0,
        cvolatility: sort.indicator === "cvolatility" ? Number(composite_volatility(ts).slice(-1)[0].volatility.toFixed(0)) : 0,
        escalation: sort.indicator === "escalation" ? Number(escalation(ts).slice(-1)[0].escalation.toFixed(0)) : 0,
      };
    });
  }, [assets, datasetTimeseries, sort, assetClass]);

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

  console.log(data_sorted)

  return (
    <Fragment>

      <Wrap>
        {indicators.map(el => 
          <Button key={el} onClick={() => onSort(el)} color={el===sort.indicator?"primary":"default"}>
            <Text>{el}</Text>
            <Text> {sort.indicator === el && sort.direction === -1 ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown/>}</Text>
          </Button>
        )}
      </Wrap>

      {data_sorted?.map((el, index) => 
        <Container key={el.ticker}>
          <Between>
            <Flex>
              <Text color='light' size={10}>{index+1}.{el.ticker}.</Text>
              <Hover message={formatDate(el.updatedAt)}><Link to={customLinkUrl(el as any)}><Text size={18}>{el.name.toUpperCase()}</Text></Link></Hover>
              <Text color="light" size={10}>${el.latest}</Text>
            </Flex>
            {sort.indicator === "rsi" &&<TextIndent color={el.rsi > 75 ? "green" : el.rsi < 25 ? "red" : "default"}>{el.rsi}</TextIndent>}
            {sort.indicator === "roi" && <TextIndent color={el.roi > 0 ? "green" : "red"}>{el.roi}</TextIndent>}
            {sort.indicator === "pchigh" && <TextIndent color={el.pchigh > 75 ? "green" : el.pchigh < 25 ? "red" : "default"}>{el.pchigh}</TextIndent>}
            {sort.indicator === "escalation" && <TextIndent color={el.escalation > 0 ? "green" : "red"}>{el.escalation}</TextIndent>}
            {sort.indicator === "cvolatility" && <TextIndent>{el.cvolatility}</TextIndent>}
          </Between>
      </Container>
      )}

    </Fragment>
  )
}

export default Pchigh