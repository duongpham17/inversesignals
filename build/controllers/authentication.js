"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.forgot = exports.signup = exports.login = exports.persist = exports.protect = exports.restrict = exports.createSecureToken = void 0;
const authnetication_1 = require("../@email/authnetication");
const helper_1 = require("../@utils/helper");
const users_1 = __importDefault(require("../models/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const createSecureToken = (id) => {
    const secret = process.env.JWT_SECRET;
    const expires = process.env.JWT_EXPIRES;
    const token = jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: `${expires}d` });
    const expireInNumber = Date.now() + (expires * 24 * 60 * 60 * 1000);
    const cookie = {
        token: `Bearer ${token}`,
        expires: expireInNumber,
    };
    return cookie;
};
exports.createSecureToken = createSecureToken;
const restrict = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new helper_1.appError('You do not have permission to perform this action', 403));
        }
        ;
        next();
    };
};
exports.restrict = restrict;
exports.protect = (0, helper_1.asyncBlock)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token)
        return next(new helper_1.appError('Login to access these features', 401));
    const jwt_secret = process.env.JWT_SECRET;
    const decodedId = jsonwebtoken_1.default.verify(token, jwt_secret);
    const existingUser = await users_1.default.findById(decodedId.id);
    if (!existingUser)
        return next(new helper_1.appError('The user belonging to this token does not exist.', 401));
    req.user = existingUser;
    next();
});
exports.persist = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const id = req.user._id;
    const user = await users_1.default.findById(id);
    if (!user)
        return next(new helper_1.appError('please log back in for a new token', 401));
    res.status(201).json({
        status: "success",
        data: user
    });
});
exports.login = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { username } = req.body;
    const isEmail = username.includes("@");
    let user;
    if (isEmail) {
        user = await users_1.default.findOne({ email: username }).select("password");
    }
    else {
        user = await users_1.default.findOne({ username }).select("password");
    }
    ;
    if (!user)
        return next(new helper_1.appError("No user found, please sign up.", 400));
    const isCorrect = await user.correctPassword(req.body.password, user.password);
    if (!isCorrect)
        return next(new helper_1.appError("Password is incorrect.", 400));
    const cookie = (0, exports.createSecureToken)(user._id.toString());
    res.status(200).json({
        status: "success",
        data: user,
        cookie
    });
});
exports.signup = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { username } = req.body;
    const isUserExist = await users_1.default.findOne({ username });
    if (isUserExist)
        return next(new helper_1.appError("Username taken.", 401));
    const user = await users_1.default.create({ ...req.body, username, verified: false });
    const cookie = (0, exports.createSecureToken)(user._id.toString());
    res.status(200).json({
        status: "success",
        data: user,
        cookie
    });
});
exports.forgot = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { email } = req.body;
    const user = await users_1.default.findOne({ email });
    if (!user)
        return next(new helper_1.appError("Email does not exist.", 401));
    const token = await user.createVerifyToken();
    await (0, authnetication_1.Forgot)({ email, token });
    res.status(200).json({
        status: "success",
    });
});
exports.reset = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { token, password } = req.body;
    const hash = crypto_1.default.createHash('sha256').update(token).digest('hex');
    let user = await users_1.default.findOne({ verify_token: hash }).select("verify_token_expiry verify_token");
    if (!user)
        return next(new helper_1.appError("Reset password failed, unable to authneticate.", 401));
    const linkExpired = Date.now() > user.verify_token_expiry;
    if (linkExpired)
        return next(new helper_1.appError("Token has expired, try again.", 401));
    user.password = password;
    user.verify_token = undefined;
    user.verify_token_expiry = undefined;
    await user.save();
    const cookie = (0, exports.createSecureToken)(user._id.toString());
    res.status(200).json({
        status: "success",
        data: user,
        cookie
    });
});
