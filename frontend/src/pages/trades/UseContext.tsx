import React, { createContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import Trade from '@redux/actions/trades';

export interface PropsTypes {

};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({

});

const UseContextHome = ({children}: {children: React.ReactNode}) => {

    const [ dispatch ] = [useAppDispatch()];

    const { trades } = useAppSelector(state => state.trades);

    useEffect(() => {
        if(!trades) dispatch(Trade.find());
    }, [trades, dispatch]);

    const value = {

    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default UseContextHome