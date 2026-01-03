export const timeseriesInterval = ["1h", "4h", "1d", "1w"];

export type TAssetsDataset = number[];

export interface IAssets {
    _id: string,
    name: string,
    keywords: string,
    api: string,
    ticker: string,
    class: string,
    supply: number,
    xtype: string,
    xlabel: string,
    dataset_1h: TAssetsDataset[],
    dataset_4h: TAssetsDataset[],
    dataset_1d: TAssetsDataset[],
    dataset_1w: TAssetsDataset[],
    createdAt: number
};

export type TDatasetTimeseries = "dataset_1h" | "dataset_4h" | "dataset_1d" | "dataset_1w";

export interface IAssetsSelect {
    _id: string,
    name: string,
    class: string,
    ticker: string,
};

/*STATE**************************************************************************************************************/

export interface INITIALSTATE {
    assets: IAssets[] | null,
    asset: IAssets | null,
    names: IAssetsSelect[] | null,
};

/*ACTION**************************************************************************************************************/

export enum TYPES {
    ASSETS_FIND        = "ASSETS_FIND",
    ASSETS_FIND_ID     = "ASSETS_FIND_ID",
    ASSETS_FIND_SELECT = "ASSETS_FIND_SELECT",
};

interface AssetsFind {
    type: TYPES.ASSETS_FIND,
    payload: IAssets[];
};

interface AssetsFindId {
    type: TYPES.ASSETS_FIND_ID,
    payload: IAssets
};

interface AssetsSelect {
    type: TYPES.ASSETS_FIND_SELECT,
    payload: IAssetsSelect[]
}

export type ACTIONS = 
    AssetsFind | AssetsFindId | AssetsSelect