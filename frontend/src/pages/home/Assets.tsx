import { Fragment, useContext } from 'react';
import { Context } from './UseContext';
import { TDatasetTimeseries } from '@redux/types/assets';
import { Link } from 'react-router-dom';
import { IAssets } from '@redux/types/assets';
import { formatNumbersToString } from '@utils/functions';
import { percentage_change } from '@utils/forumlas';
import Container from '@components/containers/Style3';
import Search from '@components/searchbars/Style2';
import Button from '@components/buttons/Style1';
import Wrap from '@components/flex/Wrap';
import Flex from '@components/flex/Flex';
import Text from '@components/texts/Style2';
import Loader from '@components/loaders/Style1';
import Between from '@components/flex/Between';

const styles = { width1: "130px", width2: "110px" };

const AssetsComponent = () => {

  const {assets, assetClass} = useContext(Context);

  if(!assets) return <Loader/>

  return (
    <>

      <SearchCrypto assets={assets} />
      
      <Assets assets={assets.filter(el => el.class === assetClass)} />

    </>
  )
};

const Assets = ({assets}: {assets: IAssets[]}) => {

  const {datasetTimeseries} = useContext(Context);

  const latest_price = (asset: IAssets) => {
    return asset.dataset_1h.slice(-1)[0][1];
  };

  const open_price = (asset: IAssets, timeseries: TDatasetTimeseries) => {
    return asset[timeseries].slice(-1)[0][3];
  };

  const latest_volume = (asset: IAssets, timeseries: TDatasetTimeseries) => {
    return asset[timeseries].slice(-1)[0][2] * latest_price(asset);
  };

  const mcap = assets.sort((a,b) => (latest_price(b) * b.supply) - (latest_price(a) * a.supply));

  return (
    <Fragment>
      <Container>   
        <Between>
          <Text style={{width: styles.width1}}>NAME</Text>
          <Text style={{width: styles.width2}}>PRICE</Text>
          <Text style={{width: styles.width2}}>MCAP</Text>
          <Text style={{width: styles.width2}}>ROI</Text>
          <Text style={{width: styles.width2}}>VOL</Text>
        </Between>
      </Container>
      {mcap.map((el, index) => {
        const roi = percentage_change(latest_price(el), open_price(el, datasetTimeseries()))
        return (
          <Container key={el._id}>
            <Link to={`/asset?symbol=${el.ticker}&market=${el.class}&supply=${el.supply}`}>
              <Between key={el._id}>
                <Flex style={{width: styles.width1}}>
                  <Text size={10} color="light">{index+1}</Text>
                  <Text>{el.name.toUpperCase()}</Text>
                </Flex>
                <Text style={{width: styles.width2}}>$ {(latest_price(el))}</Text>
                <Text style={{width: styles.width2}}>$ {formatNumbersToString((latest_price(el) * el.supply))}</Text>
                <Text color={roi>0?"green":"red"} style={{width: styles.width2}}>{roi.toFixed(2)} %</Text>
                <Text style={{width: styles.width2}}>${formatNumbersToString(latest_volume(el, datasetTimeseries()))}</Text>
              </Between>
            </Link>
          </Container>
        )
      })}
    </Fragment>
  )
};

const SearchCrypto = ({assets}: {assets:IAssets[]}) => {

  const createLink = (name: string) => {
    const asset = assets.find(el => el.name === name);
    if(!asset) return "";
    return `/asset?id=${name}&symbol=${asset.ticker}&market=crypto&supply=${asset.supply}`
  };

  return (
    <Container>
      <Search data={assets.map(el => el.name.toLowerCase())}>
        {(results) => 
          <Wrap>
            { results.slice(0, 10).map((el) => <Link key={el} to={createLink(el)}><Button color="dark">{el}</Button></Link>) }
          </Wrap>
        }
      </Search>
    </Container>
  )
};

export default AssetsComponent;