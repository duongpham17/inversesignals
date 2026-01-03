"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upgrade = exports.search = exports.remove = exports.update = exports.create = exports.find = void 0;
const helper_1 = require("../@utils/helper");
const scripts_1 = __importDefault(require("../models/scripts"));
const users_1 = __importDefault(require("../models/users"));
exports.find = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const user = req.user;
    const data = await scripts_1.default.find({ user_id: user._id }).sort({ createdAt: -1 });
    if (!data)
        return next(new helper_1.appError("Could not find scripts data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.create = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const user = req.user;
    if (user.credit === 0)
        return next(new helper_1.appError("No credits left", 400));
    const data = await scripts_1.default.create({ ...req.body, user_id: user._id });
    await users_1.default.findByIdAndUpdate(user._id, { $inc: { credit: -1 } }, { new: true });
    if (!data)
        return next(new helper_1.appError("Could not create scripts data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.update = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await scripts_1.default.findByIdAndUpdate(req.body._id, req.body, { new: true });
    if (!data)
        return next(new helper_1.appError("Could not update scripts data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.remove = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const user = req.user;
    const data = await scripts_1.default.findByIdAndDelete(req.params.id);
    if (!data)
        return next(new helper_1.appError("Could not delete script", 400));
    await users_1.default.findByIdAndUpdate(user._id, { $inc: { credit: data.upgrade } }, { new: true });
    if (!data)
        return next(new helper_1.appError("Could not remove scripts data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.search = (0, helper_1.asyncBlock)(async (req, res, next) => {
    // Escape special regex characters to prevent errors
    const escapedId = req.params.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Create a case-insensitive regex
    const regex = new RegExp(escapedId, 'i');
    const data = await scripts_1.default.find({ private: false, name: regex }).sort({ createdAt: -1 });
    if (!data)
        return next(new helper_1.appError("Could not find scripts data", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.upgrade = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { _id, upgrade, inc } = req.body;
    // Validate inc
    if (inc !== 1 && inc !== -1) {
        return next(new helper_1.appError("Invalid operation", 400));
    }
    // Validate upgrade amount
    const amount = Number(upgrade);
    if (!amount || amount <= 0 || amount > 10000) {
        return next(new helper_1.appError("Invalid upgrade amount", 400));
    }
    const script = await scripts_1.default.findById(_id);
    if (!script)
        return next(new helper_1.appError("Script not found", 404));
    const user = await users_1.default.findById(req.user._id);
    if (!user)
        return next(new helper_1.appError("User not found", 404));
    // If user needs to spend credit
    if (inc === 1 && user.credit < amount) {
        return next(new helper_1.appError("Not enough credit", 400));
    }
    // New upgrade value
    const newUpgradeValue = script.upgrade + (inc === 1 ? amount : -amount);
    if (newUpgradeValue < 0) {
        return next(new helper_1.appError("Upgrade cannot go negative", 400));
    }
    // Apply both updates safely
    const [updatedScript] = await Promise.all([
        scripts_1.default.findByIdAndUpdate(_id, { upgrade: newUpgradeValue }, { new: true }),
        users_1.default.findByIdAndUpdate(req.user._id, { $inc: { credit: inc === 1 ? -amount : amount } }, { new: true })
    ]);
    return res.status(200).json({
        status: "success",
        data: updatedScript
    });
});
