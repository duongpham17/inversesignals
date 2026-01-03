import { useContext } from 'react';
import { Context } from './UseContext';
import { useAppSelector } from '@redux/hooks/useRedux';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Button from '@components/buttons/Style1';
import Line from '@components/line/Style1';
import Options from '@components/options/Style1';
import Hover from '@components/hover/Style1';
import Text from '@components/texts/Style1';
import { MdCandlestickChart, MdOutlineStackedLineChart } from "react-icons/md";
import { RiFileHistoryLine } from "react-icons/ri";
import Binance from './binance';
import Hyperliquid from './hyperliquid';

const Pages = () => {

    const {user} = useAppSelector(state => state.authentications);

    const {price, page, timeseries_set, timeseries, setTimeseries, limits_set, limits, setLimits, viewChart, onViewChart, setOpenItem} = useContext(Context);

    return (            
        <>

        <Line color="primary"/>

        <Between>
            <Flex>
                <Text size={25} color="primary">{price}</Text>
            </Flex>
            <Flex>
                <Options color="dark" options={timeseries_set.map(el => String(el))} value={String(timeseries)} onClick={time => setTimeseries(time)} />
                <Options color="dark" options={limits_set.map(el => String(el))} value={String(limits)} onClick={limit => setLimits(Number(limit))} />
                <Button color="dark" onClick={onViewChart}>{viewChart === "candle" ? <MdCandlestickChart/> : <MdOutlineStackedLineChart/>}</Button>
                {user && <Hover message="Trade"><Button color="dark" onClick={() => setOpenItem("record")}><RiFileHistoryLine/></Button></Hover>}
            </Flex>
        </Between>

        {page === 1 && <Hyperliquid /> }

        {page === 2 && <Binance /> }

        </>
    )
}

export default Pages