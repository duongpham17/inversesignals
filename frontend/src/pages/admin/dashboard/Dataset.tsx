import { Fragment, useContext } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import { IAssets } from '@redux/types/assets';
import { formatDate } from '@utils/functions';
import Container from '@components/containers/Style1';
import Flex from '@components/flex/Flex';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style1';
import Hover from '@components/hover/Style1';
import Pagination from '@components/paginations/Style1';
import AreaChart from '@charts/Area';

const Dataset = ({asset}: {asset: IAssets}) => {

  const { datasetTimeseries } = useContext(Context);

  return (
    <Fragment>
      <Flex>
        <Hover message="Total Data"><Button><Text size={25}>Dataset [ {asset[datasetTimeseries()].length} ]</Text></Button></Hover>
        <Hover message="Dataset Type"><Text size={25}> {asset.xtype} </Text></Hover>
      </Flex>

      <AreaChart 
        data={asset[datasetTimeseries()].map(el => ({
          date: el[0],
          $:el[1],
          Volume: el[2],
        }))}
        xkey='date'
        ykey="$"
      />
    
      <Pagination limit={10} data={[...asset[datasetTimeseries()]].reverse()}>
        {(dataset) => (
          dataset.map((el, index) => (
            <Container key={index}>
                {(el ?? []).map((key: any, i: number) => (
                    <Text key={i} color={i % 2 === 0 ? "default" : "light"}>
                        {asset.xlabel?.split(" ")[i]}: {i === 0 
                            ? `${formatDate(key)}, ${key}` 
                            : key}
                    </Text>
                ))}
            </Container>
          ))
        )}
      </Pagination>
    </Fragment>
  )
};

const AdminDashboardDataset = () => {

  const { asset } = useAppSelector(state => state.admin_assets);

  if(!asset) return <div></div>

  return (
    <Fragment>
      <Dataset asset={asset} />
    </Fragment>
  )
}

export default AdminDashboardDataset;