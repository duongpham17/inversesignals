import { useContext, useEffect, useState } from 'react';
import { Context } from '../UseContext';
import { composite_volatility, escalation, percentage_from_high, vwap, calculate_trade_metrics } from '@utils/forumlas';
import { THyperliquidKlines } from 'exchanges/hyperliquid';
import { formatNumbersToString } from '@utils/functions';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { ITrades } from '@redux/types/trades';
import Trades from '@redux/actions/trades';
import useForm from '@hooks/useForm';

import Container from '@components/containers/Style3';
import Cover from '@components/covers/Style2';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Wrap from '@components/flex/Wrap';
import Button from '@components/buttons/Style1';
import Text from '@components/texts/Style2';
import TextPlain from '@components/texts/Style1';
import Form from '@components/forms/Style1';
import Input from '@components/inputs/Style1';
import Options from '@components/options/Style1';
import { RiDeleteBin4Line } from "react-icons/ri";

interface ITradeProps {
  candles: THyperliquidKlines,
}

const Trade = ({candles}: ITradeProps) => {

  const dispatch = useAppDispatch();

  const { open } = useAppSelector(state => state.trades);

  const { symbol, timeseries, openItem, setOpenItem, price } = useContext(Context);

  const [ openTrade, setOpenTrade ] = useState<ITrades | null>(null);

  const initialState: Partial<ITrades> = {
    ticker: symbol!,
    timeseries: timeseries,
    side: "long",
    leverage: 10,
    size: 0,
    fees: 0,
    open_klines: candles.slice(-1)[0],
    close_klines: [],
    x_streaks: 0,
    x_escalation: Number(escalation(candles).slice(-1)[0].escalation.toFixed(2)),
    x_pchigh: Number(percentage_from_high(candles).slice(-1)[0].pchigh.toFixed(2)),
    x_vwap: Number(vwap(candles).slice(-1)[0].vwap.toFixed(2)),
    x_composite_volatility: Number(composite_volatility(candles).slice(-1)[0].volatility.toFixed(2)),
  };

  const { values, onChange, onSubmit, onSetValue } = useForm(initialState, callback, "");

  async function callback(){
    const customKlines: any = values.open_klines;
    const open_klines = typeof values.open_klines === "string" ? customKlines.split(",").map((el:string) => Number(el)) as number[] : values.open_klines;
    values.open_klines = open_klines;
    await dispatch(Trades.create(values));
    setOpenItem("");
  };

  const close = async () => {
    if(!openTrade) return;
    await dispatch(Trades.close({...openTrade, close_klines: candles.slice(-1)[0]}));
    setOpenTrade(null);
  };

  const remove = async () => {
    if(!openTrade) return;
    await dispatch(Trades.remove(openTrade._id));
    setOpenTrade(null);
  };

  useEffect(() => {
    dispatch(Trades.open(symbol!))
  }, [dispatch, symbol]);

  return (
    <Container>

      <Wrap>
        {open?.map(el => {
          const metrics = calculate_trade_metrics(price, el.open_klines[1], el.side, el.size, el.leverage)
          return (
            <Button key={el._id} onClick={() => setOpenTrade(el)}>
              <TextPlain color={metrics.roi > 0 ? "green" : "red"}>{el.side.charAt(0).toUpperCase()} {formatNumbersToString(el.size)} @ {el.open_klines[1]} ${metrics.pnl.toFixed(2)}</TextPlain>
            </Button>
          )
        })}
      </Wrap>
    
      {openTrade  &&
        <Cover open={openTrade ? true : false} onClose={() => setOpenTrade(null)}>
          <Form>
            <Between>
              <Text size={20}>{openTrade.ticker} ( {openTrade.size} ) {openTrade.side.toUpperCase()} {openTrade.leverage}x</Text>
              <Flex>
                <Button onClick={close} color="primary">Close</Button>
                <Button color="dark" onClick={remove}><RiDeleteBin4Line/></Button>
              </Flex>
            </Between>
            <Text>Cost: ${openTrade.size * openTrade.open_klines[1]}</Text>
            <Text>Margin: ${openTrade.size * openTrade.open_klines[1] / openTrade.leverage}</Text>
            <Text size={30}>${calculate_trade_metrics(price, openTrade.open_klines[1], openTrade.side, openTrade.size, openTrade.leverage).pnl.toFixed(2)}</Text>
          </Form>
        </Cover>
      }

      <Cover open={openItem==="record"?true:false} onClose={() => setOpenItem("")}>
        <Form onSubmit={onSubmit} width={600}>

          <Container>
            <Text size={20}>{values.ticker} [ {values.timeseries} ]</Text>
          </Container>

          <Container>
            <Flex>
              <Input type="number" label1="Leverage" name="leverage" value={values.leverage} onChange={onChange} />
              <Input type="number" label1="Size" name="size" value={values.size || ""} onChange={onChange} />
              <Input type="number" label1="Streaks" name="x_streaks" value={values.x_streaks || ""} onChange={onChange} />
              <Options label1="Side" options={["long", "short"]} value={values.side} onClick={(side) => onSetValue({side})} />
            </Flex>
          </Container>

          <Container>
            <Input label1="Open Klines" name="open_klines" value={values.open_klines?.toString()} onChange={onChange} />
          </Container>

          <Container>
            <Flex>
              <Input type="number" label1="Vwap" name="x_vwap" value={values.x_vwap} onChange={onChange} />
              <Input type="number" label1="Escalation" name="x_escalation" value={values.x_escalation} onChange={onChange} />
              <Input type="number" label1="Pchigh" name="x_pchigh" value={values.x_pchigh} onChange={onChange} />
              <Input type="number" label1="Composite V" name="x_composite_volatility" value={values.x_composite_volatility} onChange={onChange} />
            </Flex>
          </Container>

          <Button color="primary" type="submit">Create</Button>

        </Form>
      </Cover>
    </Container>
  )
};

export default Trade;