import { Dispatch } from 'redux';
import { IAssets, IAssetsSelect } from '@redux/types/assets';
import { ACTIONS, TYPES, TAssetCreate} from '@redux/types/admin_assets';
import { api } from '@redux/api';

const endpoint = "/admin/assets";

const findSelect = () => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`${endpoint}/select`);
        dispatch({
            type: TYPES.ADMIN_ASSETS_FIND_SELECT,
            payload: res.data.data as IAssetsSelect[]
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const create = (data: TAssetCreate) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.post(`${endpoint}`, data);
        dispatch({
            type: TYPES.ADMIN_ASSETS_CREATE,
            payload: res.data.data as IAssets
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const update = (data: IAssets) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.patch(`${endpoint}`, data);
        dispatch({
            type: TYPES.ADMIN_ASSETS_UPDATE,
            payload: res.data.data as IAssets
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const remove = (id: IAssets["_id"]) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        await api.delete(`${endpoint}/${id}`);
        dispatch({
            type: TYPES.ADMIN_ASSETS_DELETE,
            payload: id
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const findid = (id: IAssets["_id"]) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`${endpoint}/${id}`);
        dispatch({
            type: TYPES.ADMIN_ASSETS_FIND_ID,
            payload: res.data.data as IAssets
        });
    } catch(error:any){
        console.log(error.response);
    }
};


const Actions = {
    findSelect,
    findid,
    create,
    update,
    remove
};

export default Actions;