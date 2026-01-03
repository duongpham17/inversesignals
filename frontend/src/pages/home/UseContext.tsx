import React, { createContext, useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { TDatasetTimeseries } from '@redux/types/assets';
import { IIndices } from '@redux/types/indices';
import Asset from '@redux/actions/assets';
import Indices from '@redux/actions/indices';

export interface PropsTypes {
    loading: boolean,
    page: number,
    onPage: (side: 1 | -1) => void,
    timeseries: string,
    setTimeseries: (t: string) => void,
    datasetTimeseries: () => TDatasetTimeseries,
    onCreateIndices: () => Promise<void>,
    onUpdateIndices: (data: IIndices) => Promise<void>,
    onDeleteIndices: (id: string) => Promise<void>,
    assetClass: "crypto" | "stock",
    setAssetClass: React.Dispatch<React.SetStateAction<"crypto" | "stock">>,
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    loading: false,
    page: 1,
    onPage: (side) => {},
    timeseries: "1h",
    setTimeseries: () => "",
    datasetTimeseries: () => "dataset_1h",
    onCreateIndices: async () => {},
    onUpdateIndices: async (data: IIndices) => {},
    onDeleteIndices: async (id: string) => {},
    assetClass: "crypto",
    setAssetClass: () => null,
});

const UseContextHome = ({children}: {children: React.ReactNode}) => {

    const [dispatch, location, navigate] = [useAppDispatch(), useLocation(), useNavigate()];

    const [loading, setLoading] = useState(false);

    const [assetClass, setAssetClass] = useState<"crypto" | "stock">("crypto");

    const {assets} = useAppSelector(state => state.assets);

    const {indices} = useAppSelector(state => state.indices);

    const page = useMemo(() => {
        const param = new URLSearchParams(location.search).get("page");
        return Number(param) || 1;
    }, [location.search]);

    useEffect(() => {
        if(!assets) dispatch(Asset.find());
        const minutes = 60000 * 1 
        const intervalId = setInterval(() => dispatch(Asset.find()), minutes);
        return () => clearInterval(intervalId);
    }, [dispatch, assets]);

    useEffect(() => {
        if(page === 3 && !indices) dispatch(Indices.find());
    }, [dispatch, page, indices])

    const onPage = (side: -1 | 1) => {
        const maxPage = 6;
        const next = page + side;
        if (next < 1 || next > maxPage) return;

        const params = new URLSearchParams(location.search);
        params.set("page", String(next));

        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });
    };

    const timeseries = useMemo(() => {
        const param = new URLSearchParams(location.search).get("timeseries");
        return param || "1h";
    }, [location.search]);

    const setTimeseries = (t: string) => {
        const params = new URLSearchParams(location.search);
        params.set("timeseries", t);
        navigate(`?${params.toString()}`);
    };

    const datasetTimeseries = (): TDatasetTimeseries => {
        if(timeseries === "1h") return "dataset_1h";
        if(timeseries === "4h") return "dataset_4h";
        if(timeseries === "1d") return "dataset_1d";
        if(timeseries === "1w") return "dataset_1w";
        return "dataset_1h";
    };

    const onCreateIndices = async () => {
        setLoading(true);
        await dispatch(Indices.create({name: "NEW"}));
        setLoading(false);
    };

    const onUpdateIndices = async (data: IIndices) => {
        setLoading(true);
        await dispatch(Indices.update(data));
        setLoading(false);
    };

    const onDeleteIndices = async (id: string) => {
        setLoading(true);
        await dispatch(Indices.remove(id));
        setLoading(false);
    };

    const value = {
        loading,
        page, onPage,
        timeseries, setTimeseries, datasetTimeseries,
        onCreateIndices, onUpdateIndices, onDeleteIndices,
        assetClass, setAssetClass,
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default UseContextHome