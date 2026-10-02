import React, { createContext, useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface PropsTypes {
    name: string | null,
    symbol: string | null,
    supply: string | null,
    market: string | null,
    exchange: string,
    setExchange: (exchange: string) => void,
    timeseries_set: string[],
    timeseries: string,
    setTimeseries: (x: string) => void,
    limits_set: number[],
    limits: number,
    setLimits: (x: number) => void,
    price: number,
    setPrice: React.Dispatch<React.SetStateAction<number>>
    viewChart: string,
    onViewChart: () => void,
    openItem: string,
    setOpenItem: React.Dispatch<React.SetStateAction<string>>
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    name:  "",
    symbol: "",
    supply: "",
    exchange: "",
    market: "",
    setExchange: () => {},
    timeseries_set: [],
    timeseries: "1h",
    setTimeseries: () => "",
    limits_set: [],
    limits: 100,
    setLimits: () => "",
    price: 0,
    setPrice: () => "",
    viewChart: "candle",
    onViewChart: () => "",
    openItem: "",
    setOpenItem: () => "",
});

const UseContextCrypto = ({children}: {children: React.ReactNode}) => {

    const [ location, navigate ] = [ useLocation(), useNavigate() ];
    const query = new URLSearchParams(location.search)
    const [ name, symbol, supply, market ] = [query.get("name"), query.get("symbol"), query.get("supply"), query.get("market")];
    const [ price, setPrice ] = useState<number>(0);
    const [ viewChart, setViewChart ] = useState<string>("candle");
    const [ openItem, setOpenItem ] = useState<string>("");

    const timeseries_set = ["1m", "5m", "15m", "30m", "1h", "4h", "1d", "1w"];

    const timeseries = useMemo(() => {
        const param = new URLSearchParams(location.search).get("timeseries");
        return param || "1h";
    }, [location.search]);

    const setTimeseries = (t: string) => {
        const params = new URLSearchParams(location.search);
        params.set("timeseries", t);
        navigate(`?${params.toString()}`);
    };

    const limits_set = [20, 50, 100, 200, 300, 400, 500];

    const limits = useMemo(() => {
        const param = new URLSearchParams(location.search).get("limits");
        return Number(param) || 100;
    }, [location.search]);

    const setLimits = (t: number) => {
        const params = new URLSearchParams(location.search);
        params.set("limits", String(t));
        navigate(`?${params.toString()}`);
    };

    const exchange = useMemo(() => {
        const param = new URLSearchParams(location.search).get("exchange");
        return param || "binance"
    }, [location.search]);

    const setExchange = (exchange: string) => {
        const params = new URLSearchParams(location.search);
        params.set("exchange", exchange);
        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });
    };

    useEffect(() => {
        document.title = `${market==="stock"?symbol?.slice(0, -1):symbol} ${price.toString()}`;
    }, [price, symbol, market])

    const chartViews = ["candle", "line"];
    const onViewChart = () => {
        const nextIndex = (chartViews.indexOf(viewChart) + 1) % chartViews.length;
        setViewChart(chartViews[nextIndex]);
    };

    const value = {
        name, symbol, supply, market,
        price, setPrice,
        timeseries_set, timeseries, setTimeseries,
        limits_set, limits, setLimits, 
        exchange, setExchange,
        viewChart, onViewChart,
        openItem, setOpenItem
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default UseContextCrypto