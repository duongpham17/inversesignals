import React, {useState} from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import { calculate_trade_metrics } from '@utils/forumlas';
import { formatNumbersToString } from '@utils/functions';
import { ITrades } from '@redux/types/trades';
import Trades from '@redux/actions/trades';
import useForm from '@hooks/useForm';
import Text from '@components/texts/Style2';
import Between from '@components/flex/Between'
import Container from '@components/containers/Style1';
import Cover from '@components/covers/Style2';
import Form from '@components/forms/Style1';
import Input from '@components/inputs/Style1';
import Options from '@components/options/Style1';
import Button from '@components/buttons/Style1';
import Line from '@components/line/Style1';

interface Props {
    data: ITrades,
    setEdit: React.Dispatch<React.SetStateAction<ITrades | null>>
}

const Edit = ({data, setEdit}: Props) => {
  const dispatch = useAppDispatch();

  const { values, edited, loading, onChange, onSubmit, onSetValue } = useForm(data, callback, "");

  async function callback(){
    const custom_o_klines: any = values.open_klines;
    values.open_klines = typeof values.open_klines === "string" ? custom_o_klines.split(",").map((el:string) => Number(el)) as number[] : values.open_klines;
    const custom_c_klines: any = values.close_klines;
    values.close_klines  = typeof values.close_klines === "string" ? custom_c_klines.split(",").map((el:string) => Number(el)) as number[] : values.close_klines;
    await dispatch(Trades.update(values));
    setEdit(null);
  };

  const onDelete = () => {
    dispatch(Trades.remove(data._id));
    setEdit(null);
  }

  return (
    <Cover open={data?true:false} onClose={() => setEdit(null)}>
        <Form onSubmit={onSubmit} width={600}>

            <Container>
                <Between>
                    <Input label1="Ticker" name="ticker" value={values.ticker} onChange={onChange} />
                    <Input label1="Timeseries" name="timeseries" value={values.timeseries} onChange={onChange} />
                    <Input type="number" label1="Leverage" name="leverage" value={values.leverage} onChange={onChange} />
                    <Input type="number" label1="Size" name="size" value={values.size} onChange={onChange} />
                    <Input type="number" label1="fees" name="fees" value={values.fees} onChange={onChange} />
                    <Options label1="Side" options={["long", "short"]} value={values.side} onClick={(side) => onSetValue({side})} />
                </Between>
            </Container>

            <Container>
                <Input label1="Open Klines" name="open_klines" value={values.open_klines?.toString()} onChange={onChange} />
                <Input label1="Close Klines" name="close_klines" value={values.close_klines?.toString()} onChange={onChange} />
            </Container>

            <Container>
                <Between>
                    <Input type="number" label1="Streaks" name="x_streaks" value={values.x_streaks || ""} onChange={onChange} />
                    <Input type="number" label1="Escalation" name="x_escalation" value={values.x_escalation} onChange={onChange} />
                    <Input type="number" label1="Pchigh" name="x_pchigh" value={values.x_pchigh} onChange={onChange} />
                    <Input type="number" label1="Composite V" name="x_composite_volatility" value={values.x_composite_volatility} onChange={onChange} />
                    <Input type="number" label1="Vwap" name="x_vwap" value={values.x_vwap} onChange={onChange} />
                </Between>
            </Container>

            {edited && <Button color="primary" type="submit" loading={loading}>Create</Button>}

            <Button color="dark" warning loading={loading} onClick={onDelete}>Delete</Button>

        </Form>
    </Cover>
  )
};

const History = () => {

    const {trades} = useAppSelector(state => state.trades);

    const [edit, setEdit] = useState<ITrades | null>(null)

    return (
        <>  

            <Text size={20}>Trade History [ {trades?.length} ]</Text>

            <Line color="primary" />

            {trades?.map(el => {
                const pnl = calculate_trade_metrics(el.close_klines[1], el.open_klines[1], el.side, el.size, el.leverage).pnl;
                return (
                    <Container key={el._id} onClick={() => setEdit(el)} color={el.close_klines.length === 0 ? "red" : "primary"}>
                        <Between>
                            <Text>{el.ticker} {el.size} {el.side.toUpperCase()} {el.leverage}x = ${formatNumbersToString(el.size * el.open_klines[1])}</Text>
                            <Text size={20} color={pnl > 0 ? "green" : "red"}>${formatNumbersToString(pnl - el.fees)}</Text>
                        </Between>
                        <Between>
                            {el.close_klines.length === 0 ? <Text color="red">Currently Trading</Text> : <Text>[ O: {el.open_klines[1]}, C:{el.close_klines[1]} ]</Text>}
                            <Text color="red">-${el.fees}</Text>
                        </Between>
                    </Container>
                )
            })}

            {edit && <Edit data={edit} setEdit={setEdit} />}
        </>
    )
}

export default History;