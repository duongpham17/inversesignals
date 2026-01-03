import mongoose, { Schema, model, Types, Document, Model } from "mongoose";

export type TAssetDataset = number[][]

export interface IAssets {
  _id: string | Types.ObjectId;
  name: string;
  keywords: string;
  api: string;
  ticker: string,
  class: string;
  supply: number,
  xtype: string;
  xlabel: string;
  dataset_1h: TAssetDataset;
  dataset_4h: TAssetDataset;
  dataset_1d: TAssetDataset;
  dataset_1w: TAssetDataset;
  createdAt: number;
};

export interface IAssetsDocument extends Document, IAssets {
  _id: Types.ObjectId;
};

const AssetsSchema = new Schema<IAssetsDocument>({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  keywords: {
    type: String,
    lowercase: true,
  },
  api: {
    type: String,
  },
  ticker: {
    type: String,
    uppercase: true,
  },
  supply: { 
    type: Number,
  },
  class: {
    type: String,
  },
  xtype: {
    type: String,
  },
  xlabel: {
    type: String,
  },
  dataset_1h: {
    type: [[Number]],
    default: [],
  },
  dataset_4h: {
    type: [[Number]],
    default: [],
  },
  dataset_1d: {
    type: [[Number]],
    default: [],
  },
  dataset_1w: {
    type: [[Number]],
    default: [],
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
}, { versionKey: false });

const Assets: Model<IAssetsDocument> = mongoose.models.Assets || model<IAssetsDocument>("Assets", AssetsSchema);
export default Assets;