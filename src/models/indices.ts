import mongoose, { Schema, model, Types, Document, Model } from "mongoose";

export interface IIndices {
  _id: string | Types.ObjectId;
  user_id: string | Types.ObjectId,
  name: string;
  assets: string[],
  createdAt: number;
};

export interface IIndicesDocument extends Document, IIndices {
  _id: Types.ObjectId;
};

const IndicesSchema = new Schema<IIndicesDocument>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  assets: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Number,
    default: () => Date.now(),
  },
}, { versionKey: false });

const Indices: Model<IIndicesDocument> = mongoose.models.Indices || model<IIndicesDocument>("Indices", IndicesSchema);
export default Indices;