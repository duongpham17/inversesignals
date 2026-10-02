import React, { createContext, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@redux/hooks/useRedux';
import { TDatasetTimeseries } from '@redux/types/assets';
import AdminAssets from '@redux/actions/admin_assets';

export interface PropsTypes {
    timeseries: string,
    setTimeseries: (t: string) => void,
    datasetTimeseries: () => TDatasetTimeseries,
};

// for consuming in children components, initial return state
export const Context = createContext<PropsTypes>({
    timeseries: "1d",
    setTimeseries: () => "",
    datasetTimeseries: () => "dataset_1d",
});

const UseContextAdminDashboard = ({children}: {children: React.ReactNode}) => {

    const [ dispatch, location, navigate ] = [useAppDispatch(), useLocation(), useNavigate()];

    const { asset, names } = useAppSelector(state => state.admin_assets)
    
    const timeseries = useMemo(() => {
        const param = new URLSearchParams(location.search).get("timeseries");
        return param || "1d";
    }, [location.search]);

    const setTimeseries = (t: string) => {
        const params = new URLSearchParams(location.search);
        params.set("timeseries", t);
        navigate(`?${params.toString()}`);
    };

    const datasetTimeseries = () => {
        return `dataset_${timeseries}` as TDatasetTimeseries
    };

    useEffect(() => {
        const id = new URLSearchParams(location.search).get("id");
        if (id && !asset) dispatch(AdminAssets.findid(id));
    }, [location, dispatch, asset]);

    useEffect(() => {
        if(!names) dispatch(AdminAssets.findSelect());
    }, [dispatch, names]);

    const value = {
        timeseries, setTimeseries, datasetTimeseries
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export default UseContextAdminDashboard