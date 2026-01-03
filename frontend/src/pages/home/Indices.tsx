import { Fragment, useState, useContext, useMemo } from 'react';
import { useAppSelector } from '@redux/hooks/useRedux';
import { IIndices} from '@redux/types/indices';
import { IAssets } from '@redux/types/assets';
import { Context } from './UseContext';
import { accumulated_roi, accumulated_volume, accumulated_market_capital, accumulated_composite_volatility } from '@utils/forumlas';
import useForm from '@hooks/useForm';
import AreaChart from '@charts/Area';
import ContainerGrid from '@components/containers/Style1';
import Container from '@components/containers/Style2';
import Cover from '@components/covers/Style2';
import Form from '@components/forms/Style1';
import Button from '@components/buttons/Style1';
import Input from '@components/inputs/Style1';
import Search from '@components/searchbars/Style2';
import Wrap from '@components/flex/Wrap';
import Text from '@components/texts/Style1';
import Flex from '@components/flex/Flex';
import Loader from '@components/loaders/Style1';

interface Props {
  indice: IIndices,
  assets: IAssets[]
};
const Indice = ({indice, assets}: Props) => {

  const {onUpdateIndices, onDeleteIndices, loading, datasetTimeseries} = useContext(Context);

  const [edit, setEdit] = useState(false);

  const {values, edited, onSetValue, onChange, onSubmit} = useForm(indice, callback, "");

  async function callback(){
    await onUpdateIndices(values);
    setEdit(false);
  };

  const onAdd = (name: string) => {
    const assets = values.assets ? [...values.assets, name] : [name];
    onSetValue({assets});
  };

  const onRemove = (name: string) => {
    const assets = values.assets ? [...values.assets].filter(el => el !== name) : [];
    onSetValue({assets});
  };

  const onDelete = () => {
    onDeleteIndices(indice._id);
    setEdit(false);
  };

  const data = useMemo(() => {
    const filtered_assets = assets.filter(el => indice.assets.includes(el.name));
    const timeseries = datasetTimeseries();
    const volume = accumulated_volume(filtered_assets, timeseries);
    const roi = accumulated_roi(filtered_assets, timeseries);
    const market_capital = accumulated_market_capital(filtered_assets, timeseries);
    const ema = roi.map(el => ([new Date(el.date).getTime(), el.roi, el.roi, el.roi, el.roi, el.roi]));
    const composite_volatility = accumulated_composite_volatility(filtered_assets, timeseries);
    return ({roi, volume, ema, market_capital, composite_volatility})
  }, [assets, indice, datasetTimeseries]);

  return (
    <Fragment>

      <Button onClick={() => setEdit(!edit)}>
        <Text size={20}>{indice.name ? indice.name.toUpperCase() : "NEW"}</Text> 
        <Text size={20}>[ {indice.assets.length} ]</Text>
      </Button>

      <AreaChart data={data.market_capital} xkey='date' ykey='mcap' height={100} sync={indice._id}/>
      <AreaChart data={data.volume} xkey='date' ykey='volume' height={100} sync={indice._id}/>
      <AreaChart data={data.composite_volatility} xkey='date' ykey='volatility' height={100} sync={indice._id}/>

      <Cover open={edit} onClose={() => setEdit(!edit)}>
        <Form onSubmit={onSubmit}>
          <ContainerGrid>
            <Flex>
              <Input 
                label1="Name of indice"
                name="name"
                value={values.name}
                onChange={onChange}
              />
              <Input 
                label1="Timestamp"
                name="createdAt"
                value={values.createdAt}
                onChange={onChange}
              />
            </Flex>
            <Text color="light">Assets</Text>
            <Container>
              <Wrap>
                {values.assets.map(el =>
                  <Button key={el} color="dark" onClick={() => onRemove(el)}>{el}</Button>
                )}
              </Wrap>
            </Container>
            {edited && <Button type='submit' color="primary" loading={loading}>Save</Button>}
         </ContainerGrid>

          {assets && 
            <Container>
              <Search data={assets.map(el => el.name) || []}>
                {(data) => 
                  <Wrap>
                    {data.map(el=> 
                      <Button key={el} color={values.assets.includes(el) ? "primary" : "dark"} onClick={() => values.assets.includes(el) ? onRemove(el) : onAdd(el)}>{el}</Button>
                    )}
                  </Wrap>
                }
              </Search>
            </Container>
          }

          <Button warning onClick={onDelete}>Delete</Button>
        </Form>
      </Cover>

    </Fragment>
  )
};

const IndicesMain = () => {
  const {indices} = useAppSelector(state => state.indices);
  const {assets} = useAppSelector(state => state.assets);

  if(!indices || !assets) return <Loader/>

  return (
    <>
      {indices.map(el => 
        <Container key={el._id}>
          <Indice indice={el} assets={assets}/>
        </Container>
      )}
    </>
  )
}

export default IndicesMain