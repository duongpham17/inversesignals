"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = exports.verifyToken = exports.password = exports.remove = exports.update = exports.create = exports.find = void 0;
const helper_1 = require("../@utils/helper");
const crypto_1 = __importDefault(require("crypto"));
const users_1 = __importDefault(require("../models/users"));
const authnetication_1 = require("../@email/authnetication");
exports.find = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await users_1.default.find().sort({ createdAt: -1 }).lean();
    if (!data)
        return next(new helper_1.appError("Could not find user data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.create = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await users_1.default.create(req.body);
    if (!data)
        return next(new helper_1.appError("Could not create user data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.update = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await users_1.default.findByIdAndUpdate(req.user._id, req.body, { new: true });
    if (!data)
        return next(new helper_1.appError("Could not update user data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.remove = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await users_1.default.findByIdAndDelete(req.user._id);
    if (!data)
        return next(new helper_1.appError("Could not remove user data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.password = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { password } = req.body;
    const user = await users_1.default.findById(req.user._id).select('+password');
    if (!user)
        return next(new helper_1.appError("User not found", 404));
    user.password = password;
    await user.save();
    return res.status(200).json({
        status: "success",
        data: user
    });
});
exports.verifyToken = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { email } = req.body;
    const exist = await users_1.default.findOne({ email });
    if (exist)
        return next(new helper_1.appError("Email already exist.", 401));
    const token = await req.user.createVerifyToken();
    await (0, authnetication_1.VerifyEmail)({ email, token });
    return res.status(200).json({
        status: "success",
    });
});
exports.verifyEmail = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { email, token } = req.body;
    const hash = crypto_1.default.createHash('sha256').update(token).digest('hex');
    let user = await users_1.default.findOne({ verify_token: hash }).select("+verify_token +verify_token_expiry");
    if (!user)
        return next(new helper_1.appError("Unable to verify token, try again.", 401));
    const linkExpired = Date.now() > user.verify_token_expiry;
    if (linkExpired)
        return next(new helper_1.appError("Token has expired, try again.", 401));
    user.email = email;
    user.verify_token = undefined;
    user.verify_token_expiry = undefined;
    await user.save();
    return res.status(200).json({
        status: "success",
        data: user
    });
});
