import { useContext, useState } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { IAssets } from '@redux/types/assets';
import { candleInformation, candlePatterns } from '@utils/candles';
import useOpen from '@hooks/useOpen';
import Loader from '@components/loaders/Style1';
import Text from '@components/texts/Style2';
import Container from '@components/containers/Style1';
import Candlesticks from '@components/candlesticks/Style1';
import Wrap from '@components/flex/Wrap';
import Flex from '@components/flex/Flex';
import Button from '@components/buttons/Style1';
import ButtonAnimation from '@components/animations/buttons/Style1';
import Cover from '@components/covers/Style2';
import Form from '@components/forms/Style1';
import Options from '@components/options/Style1';
import { IoMdInformationCircle } from "react-icons/io";

const Main = ({ assets }: { assets: IAssets[] }) => {

  const { open, onOpen, array, onOpenArray } = useOpen({})
  const { datasetTimeseries, assetClass } = useContext(Context);
  const [ datapoints, setDatapoints ] = useState(10);
  const options = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"];
  const crypto = assets.filter(el => el.class === assetClass);
  const filteredCandlePatterns = array.length === 1 ? candlePatterns : candlePatterns.filter(el => array.includes(el.name));

  return (
    <>
      <Wrap>
        <Flex>
          <Options options={options} value={datapoints.toString()} onClick={v => setDatapoints(Number(v))} />
          <Button color="dark" onClick={onOpen}><IoMdInformationCircle/></Button>
        </Flex>
        {candlePatterns.map(el => 
          <Button key={el.name} onClick={() => onOpenArray(el.name)} color={array.includes(el.name) ? "primary" : "dark"}>{el.name}</Button>
        )}
      </Wrap>

      {crypto.map(asset => (
        <Container key={asset._id}>
          <Text size={20}>{asset.name.toUpperCase()}</Text>
          <Wrap>
            {filteredCandlePatterns.map(pattern => {
              const matches = pattern.detect(asset, datasetTimeseries(), datapoints);
              if (!matches.length) return null;
              return matches.map((candle, i) => (
                <Candlesticks
                  key={`${pattern.name}-${i}`}
                  data={candle}
                  label={pattern.name}
                />
              ));
            })}
          </Wrap>
        </Container>
      ))}

      <Cover open={open} onClose={onOpen}>
        <Form>
          {candleInformation.map(el =>
            <Container key={el.name}>
              <ButtonAnimation type="button" onClick={() => onOpenArray(el.name)} open={array.includes(el.name)}>{el.name}</ButtonAnimation>
              {array.includes(el.name) && <Text color="light">{el.description}</Text>}
            </Container>
          )}
        </Form>
      </Cover>
    </>
  );
};

const CandlePatterns = () => {

  const {assets} = useAppSelector(state => state.assets);

  if(!assets) return <Loader />

  return (
    <>
      <Main assets={assets} />
    </>
  )
}

export default CandlePatterns