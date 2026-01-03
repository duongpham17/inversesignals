import { NextFunction, Response, Request } from 'express';
import { appError, asyncBlock } from '../@utils/helper';
import { AuthenticatedRequest } from '../models/users';
import Indices from '../models/indices';

export const find = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const data = await Indices.find({user_id: req.user._id}).sort({createdAt: -1}).lean();

    if(!data) return next(new appError("Could not find assets", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const create = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    req.body.user_id = req.user._id;

    const data = await Indices.create(req.body);

    if(!data) return next(new appError("Could not create assets", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const update = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Indices.findByIdAndUpdate(req.body._id, req.body, {new: true});

    if(!data) return next(new appError("Could not update assets", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const remove = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Indices.findByIdAndDelete(req.params.id).lean();

    if(!data) return next(new appError("Could not remove assets", 400));

    return res.status(200).json({
        status: "success",
    });
  
});