import React, { createContext, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { useNavigate, useLocation } from 'react-router-dom';
import Trade from '@redux/actions/trades';

export interface PropsTypes {
    page: number,
    onPage: (side: 1 | -1) => void,
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    page: 1,
    onPage: (side) => {},
});

const UseContextHome = ({children}: {children: React.ReactNode}) => {

    const [ dispatch, navigate, location] = [ useAppDispatch(), useNavigate(), useLocation() ];

    const { trades } = useAppSelector(state => state.trades);

    const page = useMemo(() => {
        const param = new URLSearchParams(location.search).get("page");
        return Number(param) || 1;
    }, [location.search]);

    const onPage = (side: -1 | 1) => {
        const maxPage = 2;
        const next = page + side;
        if (next < 1 || next > maxPage) return;

        const params = new URLSearchParams(location.search);
        params.set("page", String(next));

        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });
    };

    useEffect(() => {
        if(!trades) dispatch(Trade.find());
    }, [trades, dispatch]);

    const value = {
        page, onPage
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default UseContextHome