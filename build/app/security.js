"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const validator_1 = __importDefault(require("validator"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
/**
 * Middleware to limit repeated requests from the same IP.
 * Allows 100 requests per 60 seconds per IP.
 */
const rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({ points: 200, duration: 60 });
const rateLimitMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip);
        next();
    }
    catch (err) {
        res.status(429).json({
            message: "Too many requests. Please try again later.",
        });
    }
};
/**
 * Middleware to sanitize user input in request body.
 * Escapes potentially harmful characters to prevent XSS attacks.
 */
const sanitizeInputMiddleware = (req, res, next) => {
    for (const key in req.body) {
        if (typeof req.body[key] === "string") {
            req.body[key] = validator_1.default.escape(req.body[key]);
        }
    }
    next();
};
/**
 * Middleware to set secure HTTP headers using Helmet.
 * Protects against common web vulnerabilities such as XSS, clickjacking, and MIME-type sniffing.
 * Customizes the Content-Security-Policy to allow Electron's file:// origin and inline scripts.
 */
const helmetContents = () => {
    const stripe = ["https://js.stripe.com", "https://api.stripe.com"];
    return helmet_1.default.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            defaultSrc: ["'self'", 'file:'],
            scriptSrc: ["'self'", "'unsafe-inline'", 'file:', stripe[0]],
            connectSrc: ["'self'", stripe[1]],
            frameSrc: ["'self'", stripe[0]], // <-- allow Stripe frames
        },
    });
};
const security = (app) => {
    app.use(helmetContents()); // helmet: sets HTTP headers for basic security
    app.use((0, hpp_1.default)()); // hpp: prevents HTTP parameter pollution
    app.use((0, express_mongo_sanitize_1.default)()); // mongoSanitize: removes MongoDB operators from user input
    app.use(rateLimitMiddleware); // rateLimitMiddleware: limits request rate per IP
    app.use(sanitizeInputMiddleware); // sanitizeInputMiddleware: cleans request body to prevent XSS
};
exports.default = security;
