import React, { createContext, useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface PropsTypes {
    id: string | null,
    symbol: string | null,
    page: number,
    setPage: (side: 1 | -1) => void,
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
    id: "",
    symbol: "",
    page: 1,
    setPage: () => {},
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

const UseContextAsset = ({children}: {children: React.ReactNode}) => {

    const [ location, navigate ] = [ useLocation(), useNavigate() ];
    const [ id, symbol ] = [new URLSearchParams(location.search).get("id"), new URLSearchParams(location.search).get('symbol')];
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

    const page = useMemo(() => {
        const param = new URLSearchParams(location.search).get("page");
        return Number(param) || 1;
    }, [location.search]);

    const setPage = (side: -1 | 1) => {
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
        document.title = `${symbol} ${price.toString()}`;
    }, [price, symbol])

    const chartViews = ["candle", "line"];
    const onViewChart = () => {
        const nextIndex = (chartViews.indexOf(viewChart) + 1) % chartViews.length;
        setViewChart(chartViews[nextIndex]);
    };

    const value = {
        id, symbol,
        price, setPrice,
        timeseries_set, timeseries, setTimeseries,
        limits_set, limits, setLimits, 
        page, setPage,
        viewChart, onViewChart,
        openItem, setOpenItem
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default UseContextAsset