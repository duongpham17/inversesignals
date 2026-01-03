import { Dispatch } from 'redux';
import { ACTIONS, TYPES, IIndices} from '@redux/types/indices';
import { api } from '@redux/api';

const endpoint = "/indices";

const find = () => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.get(`${endpoint}`);
        dispatch({
            type: TYPES.INDICES_FIND,
            payload: res.data.data as IIndices[]
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const create = (data: Partial<IIndices>) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.post(`${endpoint}`, data);
        dispatch({
            type: TYPES.INDICES_CREATE,
            payload: res.data.data as IIndices
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const update = (data: IIndices) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        const res = await api.patch(`${endpoint}`, data);
        dispatch({
            type: TYPES.INDICES_UPDATE,
            payload: res.data.data as IIndices
        });
    } catch(error:any){
        console.log(error.response);
    }
};

const remove = (id: IIndices["_id"]) => async (dispatch: Dispatch<ACTIONS>) => {
    try{
        await api.delete(`${endpoint}/${id}`);
        dispatch({
            type: TYPES.INDICES_DELETE,
            payload: id
        });
    } catch(error:any){
        console.log(error.response);
    }
};


const Actions = {
    find,
    create,
    update,
    remove
};

export default Actions;