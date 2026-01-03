import { Fragment, useMemo, useContext } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { accumulated_roi, accumulated_volume, accumulated_market_capital, accumulated_composite_volatility, accumulated_escalation } from '@utils/forumlas';
import AreaChart from '@charts/Area';
import Container from '@components/containers/Style2';
import Text from '@components/texts/Style2';
import Loader from '@components/loaders/Style1';
import Hover from '@components/hover/Style2';

const messages = {
  EMA: `(Exponential Moving Average) is a moving average that gives more weight to recent data, making it respond faster to price changes than a simple moving average (SMA).`,
  VOLATILITY: `Volatility is calculated by measuring the percentage change of several key data points: the price range (high versus low), price movement (close versus open), and trading activity (current volume versus average volume). Each percentage change is capped at a maximum of 100% to prevent extreme values from skewing the results. These capped values are then summed to produce a single composite volatility index.`,
  ACCUMULATEDROI: `Current percentage change of close and open price.`,
  MARKETCAPITAL: 'bitcoin, ethereum, binance, xrp, solana',
  ESCALATIOM: "Measures how often the asset price is beating previous data points, high > prevHigh, low < prevLow, open > prevOpen, volume > prevVolume, close > prevClose."
}

const Crypto = () => {
  const {assets} = useAppSelector(state => state.assets);

  const {datasetTimeseries} = useContext(Context);

  const data = useMemo(() => {
    if (!assets) return null;
    const timeseries = datasetTimeseries();
    const crypto_exclude = ["bitcoin", "ethereum", "binance", "xrp", "solana"]
    const crypto_assets = assets.filter(a => a.class === "crypto");
    const crypto_assets_exclude = crypto_assets.filter(el => !crypto_exclude.includes(el.name));
    const roi = accumulated_roi(crypto_assets, timeseries);
    const ema = roi.map(el => ([new Date(el.date).getTime(), el.roi, el.roi, el.roi, el.roi, el.roi]));
    const volume = accumulated_volume(crypto_assets, timeseries);
    const volume_exclude = accumulated_volume(crypto_assets_exclude, timeseries);
    const market_capital = accumulated_market_capital(crypto_assets, timeseries);
    const market_capital_exclude = accumulated_market_capital(crypto_assets_exclude, timeseries); 
    const composite_volatility = accumulated_composite_volatility(crypto_assets, timeseries);
    const escalation = accumulated_escalation(crypto_assets, timeseries)
    return { 
      crypto_assets, crypto_exclude,
      roi, ema, composite_volatility, escalation,
      market_capital, market_capital_exclude, 
      volume, volume_exclude,
    }
  }, [assets, datasetTimeseries]);

  const style = {
    height: 150,
    size: 20,
  }

  if(!data || !assets) return <Loader/>

  return (
    <Fragment>
      <Container>
        <Hover message={messages.VOLATILITY}><Text size={style.size}>Composite Volatility [ MAX 100 ]</Text></Hover>
        <AreaChart data={data.composite_volatility} xkey='date' ykey='volatility' height={style.height} sync="crypto" />
        <Hover message={messages.ESCALATIOM}><Text size={style.size}>Escalation</Text></Hover>
        <AreaChart data={data.escalation} xkey='date' ykey='escalation' height={style.height} sync="crypto" />
      </Container>
      <Container>
        <Hover message={messages.MARKETCAPITAL}><Text size={style.size}>Total Market Capital [ EXCLUDED TOP 5 ] [ {data.crypto_assets.length - data.crypto_exclude.length} ]</Text></Hover>
        <AreaChart data={data.market_capital_exclude} xkey='date' ykey='mcap' height={style.height} sync="mcap" />
        <AreaChart data={data.volume_exclude} xkey='date' ykey='volume' height={style.height} sync="mcap"/>
      </Container>
      <Container>
        <Text size={style.size}>Total Market Capital</Text>
        <AreaChart data={data.market_capital} xkey='date' ykey='mcap' height={style.height} sync="mcap" />
        <AreaChart data={data.volume} xkey='date' ykey='volume' height={style.height} sync="mcap"/>
      </Container>
    </Fragment>
  )
}

const Stock = () => {

  const {assets} = useAppSelector(state => state.assets);

  const {datasetTimeseries} = useContext(Context);

  const data = useMemo(() => {
    if (!assets) return null;
    const timeseries = datasetTimeseries();
    const stock_assets = assets.filter(a => a.class === "stock");
    const roi = accumulated_roi(stock_assets, timeseries);
    const volume = accumulated_volume(stock_assets, timeseries);
    const ema = roi.map(el => ([new Date(el.date).getTime(), el.roi, el.roi, el.roi, el.roi, el.roi]));
    return { 
      stock_assets, roi, volume, ema
    }
  }, [assets, datasetTimeseries]);

  const height = 180;

  if(!data || !assets) return <Loader/>

  return (
    <Fragment>
      <Container>
        <Text size={20}>Accumulated Volume (Billions) [ {data.stock_assets.length} ]</Text><br/>
        <AreaChart data={data.volume} xkey='date' ykey='volume' height={height} sync="stock"/>
      </Container>
    </Fragment>
  )
};

const Grouped = () => {

  const {assetClass} = useContext(Context);

  return (
    <Fragment>

      {assetClass === "crypto" &&
        <Crypto />
      }

      {assetClass === "stock" &&
        <Stock />
      }

    </Fragment>
  )
}

export default Grouped