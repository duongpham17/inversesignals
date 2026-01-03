import { Request } from 'express';
import mongoose, { Schema, model, Types, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUsersApi {
  _id: string | Types.ObjectId,
  email: string,
  username: string,
  role: "user" | "admin",
  password: string,
  verify_token_expiry: number,
  verify_token: string,
  createdAt: number,
  correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>,
  createVerifyToken: () => Promise<string>,
};

export interface AuthenticatedRequest extends Request {
  user: IUsersApi
};

export interface IUsersDocument extends Document, IUsersApi {
  _id: Types.ObjectId,
};

const schema = new Schema<IUsersDocument>({
  username:{
    type: String,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: "user",
  },
  password: {
    type: String,
    select: false,
  },
  verify_token: {
    type: String,
    select: false
  },
  verify_token_expiry: {
    type: Number,
    default: () => Date.now() + (1 * 60 * 60 * 1000),
    select: false
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
});

schema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

schema.methods.correctPassword = async function(tryPassword: string, userPassword: string): Promise<boolean> {
  return bcrypt.compare(tryPassword, userPassword);
};

schema.methods.createVerifyToken = async function(): Promise<string> {
  const raw = crypto.randomBytes(6); // 6 bytes = 48 bits entropy
  const token = raw.toString("base64url").slice(0, 8); // safe + compact
  const hashToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verify_token = hashToken;
  this.verify_token_expiry = Date.now() + (5 * 60 * 1000); // 5 minute expiry
  await this.save();
  return token;
};

const Users: Model<IUsersDocument> = mongoose.models.Users || model<IUsersDocument>('Users', schema);
export default Users;