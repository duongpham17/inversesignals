"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
;
;
;
const schema = new mongoose_1.Schema({
    username: {
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
schema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password)
        return next();
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    next();
});
schema.methods.correctPassword = async function (tryPassword, userPassword) {
    return bcryptjs_1.default.compare(tryPassword, userPassword);
};
schema.methods.createVerifyToken = async function () {
    const raw = crypto_1.default.randomBytes(6); // 6 bytes = 48 bits entropy
    const token = raw.toString("base64url").slice(0, 8); // safe + compact
    const hashToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    this.verify_token = hashToken;
    this.verify_token_expiry = Date.now() + (5 * 60 * 1000); // 5 minute expiry
    await this.save();
    return token;
};
const Users = mongoose_1.default.models.Users || (0, mongoose_1.model)('Users', schema);
exports.default = Users;
