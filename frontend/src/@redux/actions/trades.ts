import { Dispatch } from 'redux';
import { ACTIONS, TYPES, ITrades} from '@redux/types/trades';
import { api } from '@redux/api';

const endpoint = "/trades";

const find = () => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`${endpoint}`);
        dispatch({
            type: TYPES.TRADES_FIND,
            payload: res.data.data as ITrades[]
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const create = (data: Partial<ITrades>) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.post(`${endpoint}`, data);
        dispatch({
            type: TYPES.TRADES_CREATE,
            payload: res.data.data as ITrades
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const update = (data: ITrades) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.patch(`${endpoint}`, data);
        dispatch({
            type: TYPES.TRADES_UPDATE,
            payload: res.data.data as ITrades
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const remove = (id: ITrades["_id"]) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        await api.delete(`${endpoint}/${id}`);
        dispatch({
            type: TYPES.TRADES_DELETE,
            payload: id
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const open = () => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`${endpoint}/open`);
        dispatch({
            type: TYPES.TRADES_OPEN,
            payload: res.data.data as ITrades[]
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const close = (data: ITrades) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.patch(`${endpoint}`, data);
        dispatch({
            type: TYPES.TRADES_CLOSE,
            payload: res.data.data as ITrades
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const Actions = {
    find,
    create,
    update,
    remove,
    open,
    close
};

export default Actions;