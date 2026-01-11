import { useContext } from 'react';
import { Context } from './UseContext';

import History from './History';
import Analysis from './Analysis';

const Pages = () => {
    const {page} = useContext(Context);

    return (
        <>
            {page === 1 && <History />}
            {page === 2 && <Analysis />}
        </>
    )
}

export default Pages