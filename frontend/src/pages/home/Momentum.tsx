import { useContext, useMemo, Fragment, useState, useEffect } from 'react';
import { Context } from './UseContext';
import { IAssets } from '@redux/types/assets';
import { percentage_change, percentage_difference } from '@utils/forumlas';
import { formatDate, formatNumbersToString } from '@utils/functions';
import { Link } from 'react-router-dom';
import Flex from '@components/flex/Flex';
import Container from '@components/containers/Style2';
import PlainContainer from '@components/containers/Style2';
import Text from '@components/texts/Style1';
import Loader from '@components/loaders/Style1';
import Overflow from '@components/flex/Overflow';
import Button from '@components/buttons/Style3';
import Line from '@components/line/Style1';
import Hover from '@components/hover/Style1';

const Momentum = () => {

  const {assets, assetClass, datasetTimeseries} = useContext(Context);

  const optionsList = ["latest", "accumulate"] as const;
  type TOptions = typeof optionsList[number];
  const [options, setOptions] = useState<TOptions>("latest");

  const data = useMemo(() => {
    if(!assets) return null;
    const dataset_filtered_asset_class = assets.filter(el => el.class === assetClass);
    const dataset: (IAssets & {dataset: {timestamp: number, pc: number, price: number}[]})[] = [];
    const datasetTime = datasetTimeseries();
    for(const _asset of dataset_filtered_asset_class){
      dataset.push({..._asset, dataset: []});
      const latest_price = _asset[datasetTime][_asset[datasetTime].length - 1][1];
      const oldest_price = _asset[datasetTime][0][1];
      for(let i = 1; i < _asset[datasetTime].length; i++){
        if(i === _asset[datasetTime].length - 1) continue;
        const timeseries_dataset = _asset[datasetTime][i];
        const current_price = timeseries_dataset[1]
        let pc = 0;
        if(options==="latest") pc = percentage_change(latest_price, current_price);
        if(options==="accumulate") pc = percentage_change(current_price, oldest_price);
        dataset[dataset.length - 1].dataset.push({ timestamp: timeseries_dataset[0], pc, price: current_price });
      };
    };
    dataset.sort((a, b) => {
      const aMarketCap = a.supply * a[datasetTime].slice(-1)[0][1];
      const bMarketCap = b.supply * b[datasetTime].slice(-1)[0][1];
      return bMarketCap - aMarketCap;
    });
    return dataset;
  }, [assets, assetClass, datasetTimeseries, options]);

  const statistics = useMemo(() => {
    if(!data) return null;
    const profit: {[key: string]: number} = {};
    for(const asset of data){
      for(const x of asset.dataset){
        const timestamp = x.timestamp.toString();
        profit[timestamp] = x.pc >= 0 ? (profit[timestamp] ?? 0) + 1 : (profit[timestamp] ?? 0);
      }
    };
    return Object.entries(profit).map(([timestamp, profit]) => ({timestamp: Number(timestamp), profit}));
  }, [data]);
  

  useEffect(() => {
    if(!statistics || !data) return;
    const total = data.length;
    const latest = statistics.slice(-1)[0].profit;
    const pd = percentage_difference(total, latest).toFixed(0);
    document.title = `${assetClass.toUpperCase()} ${pd}% [ ${latest} / ${total} ]`
  }, [statistics, data, assetClass])

  const width1 = "140px";
  const width2 = "95px";

  const greenOrRed = (pc: number) => pc >= 0 ? "green" : "red";

  const marketcap = (asset: IAssets) => {
    return formatNumbersToString(asset.supply * asset.dataset_1h[0][1]);
  };

  const latest_price = (asset: IAssets) => {
    return asset[datasetTimeseries()].slice(-1)[0][1];
  };

  const Sticky = () => { 
    return ( !data || !statistics ? <div></div> :
      <div>
        {/* DATE */}
        <Flex>
          <PlainContainer style={{width: width1}}>
            <Text color="light" style={{width: width1}} size={20}>Date</Text>
          </PlainContainer>
          {[...data[0].dataset].reverse().map(el =>
            <PlainContainer style={{width: width2}} key={el.timestamp}>
              <Text style={{width: width2}}>{formatDate(el.timestamp)}</Text>
            </PlainContainer>
          )}
        </Flex>
        {/* STATS */}
        <Flex>
          <PlainContainer style={{width: width1}}>
            <Text color="light" style={{width: width1}} size={20}>Stats</Text>
          </PlainContainer>
          {[...statistics].reverse().map((el) =>
            <PlainContainer color={el.profit >= (data.length / 2) ? "green" : "red"} style={{width: width2}} key={el.timestamp}>
              <Hover message={`Profit / Total`}><Text style={{width: width2}}>{percentage_difference(data.length, el.profit).toFixed(0)}% {el.profit} / {data.length}</Text></Hover>
            </PlainContainer>
          )}
        </Flex>
      </div>
    )
  };

  return ( !data ? <Loader /> :
    <Fragment>
      <Flex>
        {optionsList.map(el =>
          <Button color={el === options ? "primary" : "light"} key={el} onClick={() => setOptions(el)}>{el}</Button>
        )}
      </Flex>
      <Line color='primary'/>
      <Overflow sticky={<Sticky/>}>
        <Fragment>
          {data.map((asset, index) => 
            <Flex key={asset._id}>
              <Container style={{width: width1}}>
                <Hover message={`$${marketcap(asset)}`}>
                  <Link to={`asset?symbol=${asset.ticker}&market=${asset.class}&supply=${asset.supply}`}>
                  <Flex>
                    <Text size={12} color="light">{index+1}.</Text>
                    {assetClass === "stock" && <Text style={{width: width2}}>{asset.ticker.slice(0, -1).toUpperCase()}</Text>}
                    {assetClass === "crypto" && <Text style={{width: width2}}>{asset.ticker.toUpperCase()}</Text>}
                    <Text size={12}>${latest_price(asset)}</Text>
                  </Flex>
                </Link>
                </Hover>
              </Container>
              <Flex>
                {[...asset.dataset].reverse().map((el,index) => 
                  <Container color={greenOrRed(el.pc)} style={{width: width2}} key={el.timestamp}> 
                      <Hover message={`${index}. ${asset.name.toUpperCase()} - $${el.price} - ${formatDate(el.timestamp)}`}><Text style={{width: width2}} color={greenOrRed(el.pc)} >{el.pc.toFixed(2)}</Text></Hover>
                  </Container>
                )}
              </Flex>
            </Flex>
          )}
        </Fragment>
      </Overflow>
    </Fragment>
  )
};

export default Momentum