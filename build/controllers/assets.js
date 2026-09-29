"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamStocks = exports.historicalStocks = exports.findSelect = exports.findName = exports.findId = exports.remove = exports.update = exports.create = exports.find = void 0;
const helper_1 = require("../@utils/helper");
const assets_1 = __importDefault(require("../models/assets"));
const alpaca_1 = require("../alpaca");
exports.find = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await assets_1.default.find().sort({ createdAt: 1 }).lean();
    if (!data)
        return next(new helper_1.appError("Could not find assets", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.create = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const exist = await assets_1.default.findOne({ ticker: req.body.ticker.toUpperCase() });
    if (exist)
        return next(new helper_1.appError("Name already exist", 400));
    const data = await assets_1.default.create(req.body);
    if (!data)
        return next(new helper_1.appError("Could not create assets", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.update = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await assets_1.default.findByIdAndUpdate(req.body._id, req.body, { new: true });
    if (!data)
        return next(new helper_1.appError("Could not update assets", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.remove = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await assets_1.default.findByIdAndDelete(req.params.id).lean();
    if (!data)
        return next(new helper_1.appError("Could not remove assets", 400));
    return res.status(200).json({
        status: "success",
    });
});
exports.findId = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await assets_1.default.findById(req.params.id).lean();
    if (!data)
        return next(new helper_1.appError("Could not find assets", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.findName = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await assets_1.default.findOne({ name: req.params.name }).lean();
    if (!data)
        return next(new helper_1.appError("Could not find assets", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.findSelect = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const data = await assets_1.default.find().sort({ createdAt: 1 }).select("name class ticker").lean();
    if (!data)
        return next(new helper_1.appError("Could not find assets", 400));
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.historicalStocks = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const symbol = req.query.symbol;
    if (!symbol) {
        return next(new helper_1.appError('Stock symbol is required', 400));
    }
    const { start, end } = req.query;
    const data = await (0, alpaca_1.getHistoricalBars)(symbol, start, end);
    return res.status(200).json({
        status: "success",
        data
    });
});
exports.streamStocks = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const symbol = req.params.id?.toUpperCase();
    if (!symbol) {
        return next(new helper_1.appError('Stock symbol is required', 400));
    }
    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    // Listen for candles FIRST
    const unsubscribe = (0, alpaca_1.onCandle)(symbol, (candle) => {
        console.log('Sending candle to frontend:', candle);
        res.write(`data: ${JSON.stringify(candle)}\n\n`);
    });
    // Then subscribe to Alpaca
    (0, alpaca_1.subscribeToBars)(symbol);
    // Frontend disconnected
    req.on('close', () => {
        console.log(`Frontend disconnected from ${symbol}`);
        unsubscribe();
        res.end();
    });
});
