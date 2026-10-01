import React, { createContext, useMemo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { IAssets, TDatasetTimeseries } from '@redux/types/assets';
import { IIndices } from '@redux/types/indices';
import Asset from '@redux/actions/assets';
import Indices from '@redux/actions/indices';

export interface PropsTypes {
    assets: IAssets[] | null,
    loading: boolean,
    page: string,
    setPage: (page: string) => void
    timeseries: string,
    setTimeseries: (t: string) => void,
    datasetTimeseries: () => TDatasetTimeseries,
    onCreateIndices: () => Promise<void>,
    onUpdateIndices: (data: IIndices) => Promise<void>,
    onDeleteIndices: (id: string) => Promise<void>,
    assetClass: string,
    setAssetClass: (t: "crypto" | "stock") => void,
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    assets: null,
    loading: false,
    page: "assets",
    setPage: (page) => {},
    timeseries: "1h",
    setTimeseries: () => "",
    datasetTimeseries: () => "dataset_1h",
    onCreateIndices: async () => {},
    onUpdateIndices: async (data: IIndices) => {},
    onDeleteIndices: async (id: string) => {},
    assetClass: "stock",
    setAssetClass: () => null,
});

const UseContextHome = ({children}: {children: React.ReactNode}) => {

    const [dispatch, location, navigate] = [useAppDispatch(), useLocation(), useNavigate()];

    const [loading, setLoading] = useState(false);

    const {assets} = useAppSelector(state => state.assets);

    const {indices} = useAppSelector(state => state.indices);

    const page = useMemo(() => {
        const param = new URLSearchParams(location.search).get("page");
        return param || "assets";
    }, [location.search]);

    const setPage = (page: string) => {
        const params = new URLSearchParams(location.search);
        params.set("page", page);
        navigate({
            pathname: location.pathname,
            search: params.toString(),
        });
    };

    useEffect(() => {
        if(!assets) dispatch(Asset.find());
        const minutes = 60_000 * 1
        const intervalId = setInterval(() => dispatch(Asset.find()), minutes);
        return () => clearInterval(intervalId);
    }, [dispatch, assets]);

    useEffect(() => {
        if(page === "indicies" && !indices) dispatch(Indices.find());
    }, [dispatch, page, indices]);

    const assetClass = useMemo(() => {
        const param = new URLSearchParams(location.search).get("assetClass");
        return param || "stock";
    }, [location.search]);

    const setAssetClass = (t: "stock" | "crypto") => {
        const params = new URLSearchParams(location.search);
        params.set("assetClass", t);
        navigate(`?${params.toString()}`);
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
        assets,
        loading,
        page, setPage,
        timeseries, setTimeseries, datasetTimeseries,
        assetClass, setAssetClass,
        onCreateIndices, onUpdateIndices, onDeleteIndices,
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default UseContextHome