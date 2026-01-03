"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.download = exports.get = void 0;
const helper_1 = require("../@utils/helper");
const statistics_1 = __importDefault(require("../models/statistics"));
const _id = "6922014b7c3ece919ad7c82d";
exports.get = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await statistics_1.default.findById(_id);
    if (!data)
        return next(new helper_1.appError("Could not update statistics data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.download = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { windowInc, macInc } = req.body;
    const data = await statistics_1.default.findByIdAndUpdate(_id, {
        $inc: {
            ...(windowInc ? { window: windowInc } : {}),
            ...(macInc ? { mac: macInc } : {})
        }
    }, { new: true });
    if (!data)
        return next(new helper_1.appError("Could not update statistics data", 400));
    return res.status(200).json({
        status: "success",
    });
});
