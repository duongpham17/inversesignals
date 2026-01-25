import { useContext } from 'react';
import { Context } from './UseContext';

import History from './History';
import Analysis from './Analysis';
import Tickers from './Tickers';

const Pages = () => {

    const {page, open} = useContext(Context);

    return (
        <>
            {open === "tickers" && <Tickers/>}
            {page === 1 && <History/>}
            {page === 2 && <Analysis/>}
        </>
    )
}

export default Pages