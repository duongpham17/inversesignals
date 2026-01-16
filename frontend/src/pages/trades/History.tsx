import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@redux/hooks/useRedux';
import { calculate_trade_metrics } from '@utils/forumlas';
import { formatNumbersToString, formatDate, dateDifference, formatPrice} from '@utils/functions';
import { ITrades } from '@redux/types/trades';
import Trades from '@redux/actions/trades';
import useForm from '@hooks/useForm';
import Text from '@components/texts/Style2';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Container from '@components/containers/Style1';
import Cover from '@components/covers/Style2';
import Form from '@components/forms/Style1';
import Input from '@components/inputs/Style1';
import Options from '@components/options/Style1';
import Button from '@components/buttons/Style1';
import Hover from '@components/hover/Style1';

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
  };

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
                    <Input type="number" label1="Limits" name="x_limits" value={values.x_limits || ""} onChange={onChange} />
                    <Input type="number" label1="Avg Volume" name="x_avg_volume" value={values.x_avg_volume} onChange={onChange} />
                </Between>
            </Container>

            <Container>
                <Between>
                    <Input type="number" label1="Rsi" name="x_rsi" value={values.x_rsi} onChange={onChange} />
                    <Input type="number" label1="Candle Roi" name="x_candle_roi" value={values.x_candle_roi} onChange={onChange} />
                    <Input type="number" label1="Pchigh" name="x_pchigh" value={values.x_pchigh} onChange={onChange} />
                </Between>
            </Container>

            <Container>
                <Between>
                    <Input type="number" label1="Escalation" name="x_escalation" value={values.x_escalation} onChange={onChange} />
                    <Input type="number" label1="Composite V" name="x_composite_volatility" value={values.x_composite_volatility} onChange={onChange} />
                    <Input type="number" label1="Vwap" name="x_vwap" value={formatPrice(values.x_vwap)} onChange={onChange} />
                </Between>
            </Container>

            {edited && <Button color="primary" type="submit" loading={loading}>Update</Button>}

            <Button color="dark" warning loading={loading} onClick={onDelete}>Delete</Button>

        </Form>
    </Cover>
  )
};

const History = () => {

    const {trades} = useAppSelector(state => state.trades);
    
    const [edit, setEdit] = useState<ITrades | null>(null);

    const data = useMemo(() => {
        if(!trades) return null;
        const open_trades = trades.filter(el => !el.close_klines.length);
        const close_trades = trades.filter(el => el.close_klines.length);
        return {
            open_trades,
            close_trades
        }
    }, [trades]);

    return (
        <>  

            {data?.open_trades.map(el => {
                return (
                    <Container key={el._id} onClick={() => setEdit(el)} color="red">
                        <Between>
                            <Link to={`/asset?symbol=${el.ticker}`}><Text>{el.ticker} {el.side.toUpperCase()} {el.leverage}x</Text></Link>
                            <Text color="light">{formatDate(el.open_klines[0])}, {dateDifference(el.open_klines[0], Date.now()).string}</Text>
                        </Between>
                    </Container>
                )
            })}

            {data?.close_trades.map(el => {
                const metrics = calculate_trade_metrics(el.close_klines[1], el.open_klines[1], el.side, el.size, el.leverage);
                return (
                    <Container key={el._id} onClick={() => setEdit(el)}>
                        <Between>
                            <Text color="light">{formatDate(el.open_klines[0])}</Text>
                            <Text color="light">{formatDate(el.close_klines[0])}</Text>
                            <Text color="light">{dateDifference(el.open_klines[0], el.close_klines[0]).string}</Text>
                        </Between>
                        <Between>
                            <Link to={`/asset?symbol=${el.ticker}`}><Text>{el.ticker} {el.side.toUpperCase()} {el.leverage}x</Text></Link>
                            <Flex>
                                <Hover message="Fees"><Text>( -${el.fees} )</Text></Hover>
                                <Hover message="Roi"><Text>{((metrics.roi) * 10).toFixed(2)}%</Text></Hover>
                                <Hover message="PNL - Fees"><Text color={metrics.pnl > 0 ? "green" : "red"}>${formatNumbersToString(metrics.pnl - el.fees)}</Text></Hover>
                            </Flex>
                        </Between>
                        <Between>
                            <Text>{formatNumbersToString(el.size)} = ${formatNumbersToString(el.size * el.open_klines[1])}</Text>
                            <Hover message="Open, Close"><Text> {el.open_klines[1]} | {el.close_klines[1]}</Text></Hover>
                        </Between>
                    </Container>
                )
            })}

            {edit && <Edit data={edit} setEdit={setEdit} />}
        </>
    )
}

export default History;