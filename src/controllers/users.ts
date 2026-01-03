import { NextFunction, Response, Request } from 'express';
import { appError, asyncBlock } from '../@utils/helper';
import crypto from 'crypto';
import Users, {AuthenticatedRequest} from '../models/users';
import { VerifyEmail } from '../@email/authnetication';

export const find = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Users.find().sort({createdAt: -1}).lean();

    if(!data) return next(new appError("Could not find user data", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const create = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {

    const data = await Users.create(req.body);

    if(!data) return next(new appError("Could not create user data", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const update = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const data = await Users.findByIdAndUpdate(req.user._id, req.body, {new: true});

    if(!data) return next(new appError("Could not update user data", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const remove = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const data = await Users.findByIdAndDelete(req.user._id);

    if(!data) return next(new appError("Could not remove user data", 400));

    return res.status(200).json({
        status: "success",
        data
    });
  
});

export const password = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const {password} = req.body;

    const user = await Users.findById(req.user._id).select('+password');

    if (!user) return next(new appError("User not found", 404));

    user.password = password;
    await user.save();

    return res.status(200).json({
        status: "success",
        data: user
    });
  
});

export const verifyToken = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const {email} = req.body;

    const exist = await Users.findOne({email});

    if(exist) return next(new appError("Email already exist.", 401));

    const token = await req.user.createVerifyToken();

    await VerifyEmail({email, token})

    return res.status(200).json({
        status: "success",
    });

});

export const verifyEmail = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const {email, token} = req.body;

    const hash = crypto.createHash('sha256').update(token).digest('hex');

    let user = await Users.findOne({ verify_token: hash }).select("+verify_token +verify_token_expiry");

    if(!user) return next(new appError("Unable to verify token, try again.", 401));

    const linkExpired = Date.now() > user.verify_token_expiry;

    if(linkExpired) return next(new appError("Token has expired, try again.", 401));

    user.email = email;
    user.verify_token = undefined as any;
    user.verify_token_expiry = undefined as any;
    await user.save();

    return res.status(200).json({
        status: "success",
        data: user
    });
  
});
