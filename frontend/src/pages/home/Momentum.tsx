import { useContext, useMemo, Fragment, useState } from 'react';
import { Context } from './UseContext';
import { IAssets } from '@redux/types/assets';
import { percentage_change } from '@utils/forumlas';
import { formatDate } from '@utils/functions';
import { Link } from 'react-router-dom';
import Flex from '@components/flex/Flex';
import Container from '@components/containers/Style1';
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
    const dataset: (IAssets & {dataset: {timestamp: number, pc: number}[]})[] = [];
    const datasetTime = datasetTimeseries();
    for(const _asset of dataset_filtered_asset_class){
      dataset.push({..._asset, dataset: []});
      const latest_price = _asset[datasetTime][_asset[datasetTime].length - 1][1];
      const oldest_price = _asset[datasetTime][0][1];
      for(let i = 1; i < _asset[datasetTime].length; i++){
        const timeseries_dataset = _asset[datasetTime][i];
        let pc = 0;
        if(options==="latest") pc = percentage_change(latest_price, timeseries_dataset[1]);
        if(options==="accumulate") pc = percentage_change(timeseries_dataset[1], oldest_price);
        dataset[dataset.length - 1].dataset.push({ timestamp: timeseries_dataset[0], pc });
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
    const w_l: {[key: string]: number} = {};
    for(const asset of data){
      for(const x of asset.dataset){
        const timestamp = x.timestamp.toString();
        w_l[timestamp] = (w_l[timestamp] ?? 0) + (x.pc > 0 ? 1 : 0);
      }
    }
    return Object.entries(w_l).map(([timestamp, wl]) => ({timestamp: Number(timestamp), wl}));
  }, [data])

  const width = "90px";

  const greenOrRed = (pc: number) => pc >= 0 ? "green" : "red"

  const Sticky = () => { 
    return ( !data || !statistics ? <div></div> :
      <div>
        <Flex>
          <PlainContainer style={{width}}>
            <Text color="light" style={{width}} size={20}>Date</Text>
          </PlainContainer>
          {[...data[0].dataset].slice(0, -1).reverse().map(el =>
            <PlainContainer style={{width}} key={el.timestamp}>
              <Text style={{width}}>{formatDate(el.timestamp)}</Text>
            </PlainContainer>
          )}
        </Flex>
        <Flex>
          <PlainContainer style={{width}}>
            <Text color="light" style={{width}} size={20}>Stats</Text>
          </PlainContainer>
          {[...statistics].slice(0, -1).reverse().map(el =>
            <PlainContainer style={{width}} key={el.timestamp}>
              <Hover message="+ / -"><Text style={{width}}>{el.wl} / {data.length}</Text></Hover>
            </PlainContainer>
          )}
        </Flex>
      </div>
    )
  }

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
              <Container style={{width}}>
                <Link to={`asset?symbol=${asset.ticker}&market=${asset.class}&supply=${asset.supply}`}>
                  <Text style={{width}}>{index+1}.{asset.ticker.toUpperCase()}</Text>
                </Link>
              </Container>
              <Flex>
                {[...asset.dataset].slice(0, -1).reverse().map(el => 
                  <Container color={greenOrRed(el.pc)} style={{width}} key={el.timestamp}> 
                      <Text style={{width}} color={greenOrRed(el.pc)} >{el.pc.toFixed(2)}</Text>
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