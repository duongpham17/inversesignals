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

const Actions = {
    find,
    findSelect,
    findName,
};

export default Actions;