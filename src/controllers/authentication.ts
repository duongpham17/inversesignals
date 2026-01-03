import { NextFunction, Request, Response } from 'express';
import { Forgot } from '../@email/authnetication';
import { asyncBlock, appError } from '../@utils/helper';
import User, { AuthenticatedRequest } from '../models/users';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const createSecureToken = (id: string) => {

    const secret: any = process.env.JWT_SECRET;

    const expires: any = process.env.JWT_EXPIRES;

    const token = jwt.sign({ id }, secret, { expiresIn: `${expires}d` });

    const expireInNumber = Date.now() + (expires * 24 * 60 * 60 * 1000);

    const cookie = {
        token: `Bearer ${token}`,
        expires: expireInNumber,
    };

    return cookie;
};

export const restrict = (roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if(!roles.includes(req.user.role)){
            return next(new appError('You do not have permission to perform this action', 403))
        };
        next();
    };
};

export const protect = asyncBlock(async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return next(new appError('Login to access these features', 401));

    const jwt_secret:any = process.env.JWT_SECRET;

    const decodedId:any = jwt.verify(token, jwt_secret);

    const existingUser = await User.findById(decodedId.id);

    if(!existingUser) return next(new appError('The user belonging to this token does not exist.', 401));

    req.user = existingUser;

    next();
});

export const persist = asyncBlock(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    const id = req.user._id;

    const user = await User.findById(id);

    if(!user) return next(new appError('please log back in for a new token', 401));

    res.status(201).json({
        status: "success",
        data: user
    });
});

export const login = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {
    const {username} = req.body;
    
    const isEmail = username.includes("@");

    let user; 

    if(isEmail){
        user = await User.findOne({email: username}).select("password");
    } else {
        user = await User.findOne({username}).select("password");
    };

    if(!user) return next(new appError("No user found, please sign up.", 400));

    const isCorrect = await user.correctPassword(req.body.password, user.password);

    if(!isCorrect) return next(new appError("Password is incorrect.", 400));

    const cookie = createSecureToken(user._id.toString());

    res.status(200).json({
        status: "success",
        data: user,
        cookie
    });
});

export const signup = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {
    const {username} = req.body;

    const isUserExist = await User.findOne({username});

    if(isUserExist) return next(new appError("Username taken.", 401));

    const user = await User.create({ ...req.body, username, verified: false });

    const cookie = createSecureToken(user._id.toString());

    res.status(200).json({
        status: "success",
        data: user,
        cookie
    });
});

export const forgot = asyncBlock(async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user) return next(new appError("Email does not exist.", 401));

    const token = await user.createVerifyToken();

    await Forgot({ email, token });

    res.status(200).json({
        status: "success",
    });
});

export const reset = asyncBlock(async (req: Request, res: Response, next: NextFunction) => {
    const {token, password} = req.body;

    const hash = crypto.createHash('sha256').update(token).digest('hex');

    let user = await User.findOne({verify_token: hash}).select("verify_token_expiry verify_token");

    if(!user) return next(new appError("Reset password failed, unable to authneticate.", 401));

    const linkExpired = Date.now() > user.verify_token_expiry;

    if(linkExpired) return next(new appError("Token has expired, try again.", 401));

    user.password = password;
    user.verify_token = undefined as any;
    user.verify_token_expiry = undefined as any;
    await user.save(); 
    
    const cookie = createSecureToken(user._id.toString());

    res.status(200).json({
        status: "success",
        data: user,
        cookie
    });
});