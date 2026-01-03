"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.open = exports.remove = exports.update = exports.create = exports.find = void 0;
const helper_1 = require("../@utils/helper");
const trades_1 = __importDefault(require("../models/trades"));
exports.find = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await trades_1.default.find({ user_id: req.user._id }).sort({ createdAt: -1 }).lean();
    if (!data)
        return next(new helper_1.appError("Could not find trades data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.create = (0, helper_1.asyncBlock)(async (req, res, next) => {
    req.body.user_id = req.user._id;
    const data = await trades_1.default.create(req.body);
    if (!data)
        return next(new helper_1.appError("Could not create trades data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.update = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await trades_1.default.findByIdAndUpdate(req.body._id, req.body, { new: true });
    if (!data)
        return next(new helper_1.appError("Could not update trades data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.remove = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await trades_1.default.findByIdAndDelete(req.params.id);
    if (!data)
        return next(new helper_1.appError("Could not remove trades data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.open = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await trades_1.default.find({ user_id: req.user._id, close_klines: { $size: 0 }, ticker: req.params.id }).sort({ createdAt: -1 }).lean();
    if (!data)
        return next(new helper_1.appError("Could not find trades data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
