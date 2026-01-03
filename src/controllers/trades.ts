import { NextFunction, Response } from 'express';
import { appError, asyncBlock } from '../@utils/helper';
import { AuthenticatedRequest } from '../models/users';
import Trades from '../models/trades';

export const find = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const data = await Trades.find({user_id: req.user._id}).sort({createdAt: -1}).lean();

    if(!data) return next(new appError("Could not find trades data", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const create = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    req.body.user_id = req.user._id

    const data = await Trades.create(req.body);

    if(!data) return next(new appError("Could not create trades data", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const update = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const data = await Trades.findByIdAndUpdate(req.body._id, req.body, {new: true});

    if(!data) return next(new appError("Could not update trades data", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const remove = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const data = await Trades.findByIdAndDelete(req.params.id);

    if(!data) return next(new appError("Could not remove trades data", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const open = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const data = await Trades.find({user_id: req.user._id, close_klines: { $size: 0 }, ticker: req.params.id}).sort({createdAt: -1}).lean();

    if(!data) return next(new appError("Could not find trades data", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});