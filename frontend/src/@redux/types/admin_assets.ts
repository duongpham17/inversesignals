import {IAssets, IAssetsSelect} from './assets';

export type TAssetCreate = Partial<IAssets>

/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    names: IAssetsSelect[] | null,
    asset: IAssets | null
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    ADMIN_ASSETS_FIND_SELECT  = "ADMIN_ASSETS_FIND_SELECT",
    ADMIN_ASSETS_CREATE       = "ADMIN_ASSETS_CREATE",
    ADMIN_ASSETS_FIND_ID      = "ADMIN_ASSETS_FIND_ID",
    ADMIN_ASSETS_UPDATE       = "ADMIN_ASSETS_UPDATE",
    ADMIN_ASSETS_DELETE       = "ADMIN_ASSETS_DELETE",
};

interface Find {
    type: TYPES.ADMIN_ASSETS_FIND_SELECT,
    payload: IAssetsSelect[];
};

interface Create {
    type: TYPES.ADMIN_ASSETS_CREATE,
    payload: IAssetsSelect;
};

interface FindId {
    type: TYPES.ADMIN_ASSETS_FIND_ID,
    payload: IAssets
};

interface Update {
    type: TYPES.ADMIN_ASSETS_UPDATE,
    payload: IAssets
};

interface Delete {
    type: TYPES.ADMIN_ASSETS_DELETE,
    payload: IAssets["_id"];
};

export type ACTIONS = Find | Create | FindId | Update | Delete