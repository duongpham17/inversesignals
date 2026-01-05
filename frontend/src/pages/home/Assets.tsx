import { useContext } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { Link } from 'react-router-dom';
import { IAssets } from '@redux/types/assets';
import { formatNumbersToString } from '@utils/functions';
import { percentage_change } from '@utils/forumlas';
import ContainerGrid from '@components/containers/Style1';
import Search from '@components/searchbars/Style2';
import Button from '@components/buttons/Style1';
import Wrap from '@components/flex/Wrap';
import Text from '@components/texts/Style2';
import Loader from '@components/loaders/Style1';
import Between from '@components/flex/Between';
import Hover from '@components/hover/Style1';

const open_price = (asset: IAssets) => {
  return asset.dataset_1d.slice(-1)[0][3];
};

const latest_price = (asset: IAssets) => {
  return asset.dataset_1d.slice(-1)[0][1];
};

const latest_volume = (asset: IAssets) => {
  return asset.dataset_1d.slice(-1)[0][2] * latest_price(asset);
};

const styles = { width1: "130px", width2: "110px" };

const Crypto = ({assets}: {assets: IAssets[]}) => {

  const mcap = assets.sort((a,b) => (latest_price(b) * b.supply) - (latest_price(a) * a.supply));

  return (
    <>
    <ContainerGrid>   
      <Between>
        <Text style={{width: styles.width1}}>NAME</Text>
        <Text style={{width: styles.width2}}>PRICE</Text>
        <Text style={{width: styles.width2}}>MCAP</Text>
        <Text style={{width: styles.width2}}>ROI</Text>
      </Between>
    </ContainerGrid>
      {mcap.map((el, index) => {
        const roi = percentage_change(latest_price(el), open_price(el))
        return (
          <ContainerGrid key={el._id}>
            <Link to={`/asset?symbol=${el.ticker}`}>
              <Between key={el._id}>
                <Text style={{width: styles.width1}}>{index+1}. {el.name.toUpperCase()}</Text>
                <Text style={{width: styles.width2}}>$ {(latest_price(el))}</Text>
                <Text style={{width: styles.width2}}>$ {formatNumbersToString((latest_price(el) * el.supply))}</Text>
                <Text color={roi>0?"green":"red"} style={{width: styles.width2}}>{roi.toFixed(2)} %</Text>
              </Between>
            </Link>
          </ContainerGrid>
        )
      })}
    </>
  )
};

const Stock = ({assets}: {assets: IAssets[]}) => {

  return (
    <>
      <ContainerGrid>   
        <Between>
          <Text style={{width: styles.width1}}>NAME</Text>
          <Text style={{width: styles.width2}}>ROI</Text>
          <Text style={{width: styles.width2}}>PRICE</Text>
          <Text style={{width: styles.width2}}>VOLUME</Text>
        </Between>
      </ContainerGrid>
      {assets.map((el, index) => {
        const roi = percentage_change(latest_price(el), open_price(el))
        return (
          <ContainerGrid key={el._id}>
            <Link to={`/asset?id=${el.name}&symbol=${el.ticker}`}>
              <Between key={el._id}>
                <Text style={{width: styles.width1}}>{index+1}. {el.name.toUpperCase()}</Text>
                <Hover message="ROI"><Text color={roi>0?"green":"red"}>{roi.toFixed(2)} %</Text></Hover>
                <Hover message="Price"><Text style={{width: styles.width2}}>$ {(latest_price(el))}</Text></Hover>
                <Hover message="Volume"><Text style={{width: styles.width2}}>$ {formatNumbersToString(latest_volume(el))}</Text></Hover>
              </Between>
            </Link>
          </ContainerGrid>
        )
      })}
    </>
  )
};

const SearchCrypto = ({assets}: {assets:IAssets[]}) => {

  const createLink = (name: string) => {
    const asset = assets.find(el => el.name === name);
    if(!asset) return "";
    return `/asset?id=${name}&symbol=${asset.ticker}`
  };

  return (
    <ContainerGrid>
      <Search data={assets.map(el => el.name.toLowerCase())}>
        {(results) => 
          <Wrap>
            { results.slice(0, 10).map((el) => 
              <Link key={el} to={createLink(el)}><Button color="dark">{el}</Button></Link>
            )}
          </Wrap>
        }
      </Search>
    </ContainerGrid>
  )
};

const AssetsComponent = () => {

  const {assets} = useAppSelector(state => state.assets);

  const {assetClass} = useContext(Context);

  if(!assets) return <Loader/>

  return (
    <>

      <SearchCrypto assets={assets} />
      
      {assetClass==="crypto" && <Crypto assets={assets.filter(el => el.class === "crypto")} />}

      {assetClass==="stock" && <Stock assets={assets.filter(el => el.class === "stock")} />}

    </>
  )
}

export default AssetsComponent