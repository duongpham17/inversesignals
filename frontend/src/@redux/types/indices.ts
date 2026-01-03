export interface IIndices {
    _id: string,
    user_id: string,
    name: string,
    assets: string[],
    createdAt: number,
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    indices: IIndices[] | null,
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    INDICES_FIND    = "INDICES_FIND",
    INDICES_CREATE  = "INDICES_CREATE",
    INDICES_UPDATE  = "INDICES_UPDATE",
    INDICES_DELETE  = "INDICES_DELETE",
};

interface IndicesFind {
    type: TYPES.INDICES_FIND,
    payload: IIndices[]
};

interface IndicesCreate {
    type: TYPES.INDICES_CREATE,
    payload: IIndices;
};

interface IndicesUpdate {
    type: TYPES.INDICES_UPDATE, 
    payload: IIndices
};

interface IndicesDelete {
    type: TYPES.INDICES_DELETE, 
    payload: string
};

export type ACTIONS = 
    IndicesFind | IndicesCreate | IndicesUpdate | IndicesDelete