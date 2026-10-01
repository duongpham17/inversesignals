import { NextFunction, Response, Request } from 'express';
import { appError, asyncBlock } from '../@utils/helper';
import Assets from '../models/assets';

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