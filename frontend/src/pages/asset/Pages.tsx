import { useContext } from 'react';
import { Context } from './UseContext';
import Between from '@components/flex/Between';
import Flex from '@components/flex/Flex';
import Text from '@components/texts/Style1';
import Button from '@components/buttons/Style1';
import Line from '@components/line/Style1';
import Options from '@components/options/Style1';

import Binance from './binance';
import Hyperliquid from './hyperliquid';

const Pages = () => {

    const {page, timeseries_set, timeseries, setTimeseries, limits_set, limits, setLimits, price, viewChart, onViewChart} = useContext(Context);

    return (            
        <>

        <Line color="primary"/>

        <Between>
            <Flex>
                <Text color="primary" size={30}>{price}</Text> 
            </Flex>
            <Flex>
                {timeseries_set.map(el =>
                    <Button key={el} color={timeseries === el ? "primary" : "dark"} onClick={() => setTimeseries(el)}>{el}</Button>
                )}
                <Button color="dark" onClick={onViewChart}>{viewChart}</Button>
                <Options options={limits_set.map(el => String(el))} value={String(limits)} onClick={v => setLimits(Number(v))} />
            </Flex>
        </Between>

        <Line color="primary"/>

        {page === 1 && <Hyperliquid /> }

        {page === 2 && <Binance /> }

        </>
    )
}

export default Pages