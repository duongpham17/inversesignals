import { useContext, useEffect, useState, useMemo } from 'react';
import { Context } from '../UseContext';
import { Link } from 'react-router-dom';
import { composite_volatility, escalation, percentage_from_high, vwap, calculate_trade_metrics, calculate_volume, rsi, calculate_candle_roi } from '@utils/forumlas';
import { THyperliquidKlines } from 'exchanges/hyperliquid';
import { formatNumbersToString } from '@utils/functions';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { ITrades } from '@redux/types/trades';
import { leverage } from '@localstorage';
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
import Line from '@components/line/Style1';
import { RiDeleteBin4Line } from "react-icons/ri";

interface ITradeProps {
  candles: THyperliquidKlines,
}

const Trade = ({candles}: ITradeProps) => {

  const dispatch = useAppDispatch();

  const { open } = useAppSelector(state => state.trades);

  const { symbol, limits, timeseries, openItem, setOpenItem, price } = useContext(Context);

  const [ openTrade, setOpenTrade ] = useState<ITrades | null>(null);

  const latest = candles.slice(-1)[0];

  const initialState: Partial<ITrades> = {
    ticker: symbol!,
    timeseries: timeseries,
    side: "long",
    leverage: leverage.get() || 5,
    size: 0,
    fees: 0,
    open_klines: candles.slice(-1)[0],
    close_klines: [],
    x_avg_volume: Math.round(calculate_volume(candles)/limits),
    x_limits: limits,
    x_streaks: 0,
    x_escalation: Number(escalation(candles).slice(-1)[0].escalation),
    x_pchigh: Math.round(percentage_from_high(candles).slice(-1)[0].pchigh),
    x_vwap: Number(vwap(candles).slice(-1)[0].vwap),
    x_composite_volatility: Math.round(composite_volatility(candles).slice(-1)[0].volatility),
    x_rsi: Math.round(rsi(candles).slice(-1)[0].rsi),
    x_candle_roi: calculate_candle_roi(latest)
  };

  const { values, onChange, onSubmit, onSetValue } = useForm(initialState, callback, "");

  async function callback(){
    const customKlines: any = values.open_klines;
    const open_klines = typeof values.open_klines === "string" ? customKlines.split(",").map((el:string) => Number(el)) as number[] : values.open_klines;
    values.open_klines = open_klines;
    await dispatch(Trades.create(values));
    setOpenItem("");
    leverage.set(values.leverage!.toString())
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
    dispatch(Trades.open());
  }, [dispatch, symbol]);

  const current_trades = useMemo(() => {
    if(!open) return [];
    return open.filter(el => el.ticker === symbol)
  }, [open, symbol]);

  const current_open_trades = useMemo(() => {
    if(!open) return [];
    return [...new Set(open.map(el => el.ticker))]
  },[open]);

  return (
    <>

      { current_trades.length &&
        <Container>
          <Wrap>
            {current_trades.map(el => {
              const metrics = calculate_trade_metrics(price, el.open_klines[1], el.side, el.size, el.leverage)
              return (
                <Button key={el._id} onClick={() => setOpenTrade(el)}>
                  <TextPlain color={metrics.roi > 0 ? "green" : "red"}>{el.side.charAt(0).toUpperCase()} {formatNumbersToString(el.size)} @ {el.open_klines[1]} ${metrics.pnl.toFixed(2)}</TextPlain>
                </Button>
              )
            })}
          </Wrap>
        </Container>
      }

      {current_open_trades.length &&
        <Container>
          <Wrap>
            {current_open_trades.map(ticker => (
              <Link to={`/asset?symbol=${ticker}&limit=${limits}&timeseries=${timeseries}`} key={ticker}><Text color={ticker === symbol ? "primary" : "default"}>{ticker}</Text></Link>           
            ))}
          </Wrap>
        </Container>
      }
    
      {openTrade  &&
        <Cover open={openTrade ? true : false} onClose={() => setOpenTrade(null)}>
          <Form>
            <Between>
              <Text size={20}>{openTrade.ticker} ( {formatNumbersToString(openTrade.size)} ) {openTrade.side.toUpperCase()} {openTrade.leverage}x</Text>
              <Flex>
                <Button onClick={close} color="primary">Close</Button>
                <Button color="dark" onClick={remove}><RiDeleteBin4Line/></Button>
              </Flex>
            </Between>
            <Text>Cost: ${(openTrade.size * openTrade.open_klines[1]).toFixed(2)}</Text>
            <Text>Margin: ${(openTrade.size * openTrade.open_klines[1] / openTrade.leverage).toFixed()}</Text>
            <Text size={30} color={calculate_trade_metrics(price, openTrade.open_klines[1], openTrade.side, openTrade.size, openTrade.leverage).pnl > 0 ? "green" : "red"}>
              ${calculate_trade_metrics(price, openTrade.open_klines[1], openTrade.side, openTrade.size, openTrade.leverage).pnl.toFixed(2)}
            </Text>
            <Line color="primary" />
            <Text>Candle Roi: {openTrade.x_candle_roi} %</Text>
            <Text>Streak: {formatNumbersToString(openTrade.x_streaks)}</Text>
            <Text>Limits: {formatNumbersToString(openTrade.x_limits)}</Text>
            <Text>Rsi: {openTrade.x_rsi}</Text>
            <Text>PcHigh: {formatNumbersToString(openTrade.x_pchigh)}</Text>
            <Text>Avg Volume: ${formatNumbersToString(openTrade.x_avg_volume)}</Text>
            <Text>Composite Volatility: {formatNumbersToString(openTrade.x_composite_volatility)}</Text>
            <Text>VWAP: {formatNumbersToString(openTrade.x_vwap)}</Text>
            <Text>Esclation: {formatNumbersToString(openTrade.x_escalation)}</Text>
          </Form>
        </Cover>
      }

      {openItem==="record" &&
        <Cover open={openItem==="record"?true:false} onClose={() => setOpenItem("")}>
          <Form onSubmit={onSubmit} width={600}>

            <Container>
              <Text size={20}>{values.ticker} [ {values.timeseries} ]</Text>
            </Container>

            <Container>
              <Flex>
                <Input type="number" label1="Size" name="size" value={values.size || ""} onChange={onChange} />
                <Input type="number" label1="Streaks" name="x_streaks" value={values.x_streaks || ""} onChange={onChange} />
                <Input type="number" label1="Leverage" name="leverage" value={values.leverage} onChange={onChange} />
                <Options label1="Side" options={["long", "short"]} value={values.side} onClick={(side) => onSetValue({side})} />
              </Flex>
            </Container>

            <Container>
              <Input label1="Open Klines" name="open_klines" value={values.open_klines?.toString()} onChange={onChange} />
            </Container>

            <Container>
              <Flex>
                <Input type="number" label1="Limits" name="x_limits" value={values.x_limits} onChange={onChange} />
                <Input type="number" label1="Avg Volume" name="x_avg_volume" value={values.x_avg_volume} onChange={onChange} />
                <Input type="number" label1="Rsi" name="x_rsi" value={values.x_rsi} onChange={onChange} />
                <Input type="number" label1="Candle Roi" name="x_candle_roi" value={values.x_candle_roi} onChange={onChange} />
              </Flex>
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
      }
    </>
  )
};

export default Trade;