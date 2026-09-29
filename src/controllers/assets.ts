import { NextFunction, Response, Request } from 'express';
import { appError, asyncBlock } from '../@utils/helper';
import Assets from '../models/assets';
import { subscribeToBars, onCandle, getHistoricalBars } from '../alpaca';

export const find = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Assets.find().sort({createdAt: 1}).lean()

    if(!data) return next(new appError("Could not find assets", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const create = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const exist = await Assets.findOne({ticker: req.body.ticker.toUpperCase()});

    if(exist) return next(new appError("Name already exist", 400));

    const data = await Assets.create(req.body);

    if(!data) return next(new appError("Could not create assets", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const update = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Assets.findByIdAndUpdate(req.body._id, req.body, {new: true});

    if(!data) return next(new appError("Could not update assets", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const remove = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Assets.findByIdAndDelete(req.params.id).lean();

    if(!data) return next(new appError("Could not remove assets", 400));

    return res.status(200).json({
        status: "success",
    });
  
});

export const findId = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Assets.findById(req.params.id).lean();

    if(!data) return next(new appError("Could not find assets", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const findName = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Assets.findOne({name: req.params.name}).lean();

    if(!data) return next(new appError("Could not find assets", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const findSelect = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Assets.find().sort({createdAt: 1}).select("name class ticker").lean();

    if(!data) return next(new appError("Could not find assets", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const historicalStocks = asyncBlock(async (req: Request, res: Response, next: NextFunction) => {

    const symbol = req.query.symbol as string;

    if (!symbol) {return next(new appError('Stock symbol is required', 400)) }

    const { start, end } = req.query;

    const data = await getHistoricalBars(
        symbol,
        start as string | undefined,
        end as string | undefined
    );

    return res.status(200).json({
        status: "success",
        data
    });
});

export const streamStocks = asyncBlock(async (req: Request, res: Response, next: NextFunction) => {
    const symbol = req.params.id?.toUpperCase();

    if (!symbol) {
        return next(new appError('Stock symbol is required', 400));
    }

    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.flushHeaders();

    // Listen for candles FIRST
    const unsubscribe = onCandle(symbol, (candle) => {
        console.log('Sending candle to frontend:', candle);

        res.write(`data: ${JSON.stringify(candle)}\n\n`);
    });

    // Then subscribe to Alpaca
    subscribeToBars(symbol);

    // Frontend disconnected
    req.on('close', () => {
        console.log(`Frontend disconnected from ${symbol}`);

        unsubscribe();
        res.end();
    });
});