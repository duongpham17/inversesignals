import { Fragment, useEffect, useContext } from 'react';
import { Context } from './UseContext';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import { IAssets, timeseriesInterval } from '@redux/types/assets';
import { formatNumbersToString } from '@utils/functions';
import useForm from '@hooks/useForm';
import useOpen from '@hooks/useOpen';
import Container from '@components/containers/Style1';
import AdminAssets from '@redux/actions/admin_assets';
import Flex from '@components/flex/Flex';
import Between from '@components/flex/Between';
import Cover from '@components/covers/Style2';
import Form from '@components/forms/Style1';
import Button from '@components/buttons/Style1';
import ButtonPlain from '@components/buttons/Style3';
import Text from '@components/texts/Style1';
import TextIndent from '@components/texts/Style2';
import Hover from '@components/hover/Style1';
import Input from '@components/inputs/Style1';
import Options from '@components/options/Style1';
import { MdOutlineKeyboardBackspace } from "react-icons/md";

const Datamain = ({asset}: {asset: IAssets}) => {

  const [ dispatch, navigate] = [ useAppDispatch(), useNavigate()];

  const { timeseries, setTimeseries } = useContext(Context);

  const { open, onOpen } = useOpen({});

  const { values, setValues, edited, loading, onSetValue, onChange, onSubmit } = useForm(asset, callback, "");

  async function callback() {
    await dispatch(AdminAssets.update(values));
    onOpen()
  };

  useEffect(() => {
    setValues(asset);
  }, [asset, setValues])

  const onBack = () => {
    navigate("/admin/dashboard");
  };

  const onDelete = async () => {
    await dispatch(AdminAssets.remove(asset._id));
    navigate("/admin/dashboard");
  };

  return (
    <Fragment>

      <Between>
        <Flex>
        <Hover message="Back">
          <Button color="primary" onClick={onBack}><MdOutlineKeyboardBackspace/></Button>
        </Hover>
        <Hover message="Asset">
          <Button onClick={onOpen}><Text size={25}>{asset.name.toUpperCase()} ( {asset.ticker} )</Text></Button>
        </Hover>
        </Flex>
        <Flex>
          {timeseriesInterval.map(el =>
              <Button key={el} color={timeseries === el ? "primary" : "dark"} onClick={() => setTimeseries(el)}>{el}</Button>
          )}
        </Flex>
      </Between>

      <Container color="dark">
        <Hover message="Keywords" onClick={onOpen}>
          <TextIndent>{asset.keywords}</TextIndent>
        </Hover>
      </Container>

      <Cover open={open} onClose={onOpen}>
        <Form onSubmit={onSubmit}>
          <Container>
            <Flex>
              <Input 
                label1="Name of asset"
                name="name"
                value={values.name || ""}
                onChange={onChange}
              />
              <Input
                label1="Class"
                name="class"
                value={values.class || ""}
                onChange={onChange}
              />
              <Input
                label1="Timestamp"
                name="createdAt"
                value={values.createdAt || ""}
                onChange={onChange}
              />
            </Flex>
            <Flex>
              <Options
                label1="Api"
                options={["select","binance", "alpha"]}
                value={values.api || ""}
                onClick={(name) => onSetValue({api: name})}
              />
              <Input
                label1="Params"
                name="ticker"
                value={values.ticker || ""}
                onChange={onChange}
              />
              <Input
                label1="Supply"
                label2={formatNumbersToString(values.supply)}
                name="supply"
                value={values.supply || ""}
                onChange={onChange}
              />
            </Flex>
            <Input
              label1="Keywords"
              name="keywords"
              value={values.keywords || ""}
              onChange={onChange}
            />
            <Input
              label1="X Type"
              name="xtype"
              value={values.xtype || ""}
              onChange={onChange}
            />
            <Input
              label1="X Label"
              name="xlabel"
              value={values.xlabel || ""}
              onChange={onChange}
            />
            {edited && <Button type="submit" loading={loading} color="primary">UPDATE</Button>}
          </Container>

          <ButtonPlain color="red" warning onClick={onDelete}>Delete Asset</ButtonPlain>
        </Form>
      </Cover>
      
    </Fragment>
  )
}

const AdminDashboardDatamain = () => {

  const { asset } = useAppSelector(state => state.admin_assets);

  if(!asset) return <div>Select an asset</div>

  return (
    <Fragment>
      <Datamain asset={asset} />
    </Fragment>
  )
}

export default AdminDashboardDatamain;