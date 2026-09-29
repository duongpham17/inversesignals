import { Dispatch } from 'redux';
import { ACTIONS, TYPES, IAssets, IAssetsSelect} from '@redux/types/assets';
import { api } from '@redux/api';

const endpoint = "/assets";

const find = () => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`${endpoint}`);
        dispatch({
            type: TYPES.ASSETS_FIND,
            payload: res.data.data as IAssets[]
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const findSelect = () => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`${endpoint}/select`);
        dispatch({
            type: TYPES.ASSETS_FIND_SELECT,
            payload: res.data.data as IAssetsSelect[]
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const findName = (name: IAssets["name"]) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`${endpoint}/${name}`);
        dispatch({
            type: TYPES.ASSETS_FIND_ID,
            payload: res.data.data as IAssets
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const historicalStocks = (query: string) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`${endpoint}/stocks?${query}`);
        console.log(res.data.data)
        dispatch({
            type: TYPES.ASSETS_STOCKS_HISTORICAL,
            payload: res.data.data
        });
    } catch(error:any){
        console.log(error.response);
    }
}

const streamStocks = (name: IAssets["name"]) => (dispatch: Dispatch<ACTIONS>) => {

    const stream = new EventSource(`http://localhost:8000/api/assets/stocks/stream/${name.toUpperCase()}`);

    stream.onmessage = (event) => {

        const candle = JSON.parse(event.data);

        console.log('Candle:', candle);

        dispatch({
            type: TYPES.ASSETS_STOCKS_STREAM,
            payload: candle,
        });
    };

    stream.onerror = (error) => {
        console.error('Stock stream error:', error);
    };

    return () => {
        stream.close();
    };
};

const Actions = {
    find,
    findSelect,
    findName,
    streamStocks,
    historicalStocks
};

export default Actions;