import { Express, Request, Response, NextFunction } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";
import mongoSanitize from "express-mongo-sanitize";
import validator from "validator";
import helmet from "helmet";
import hpp from "hpp";

/**
 * Middleware to limit repeated requests from the same IP.
 * Allows 100 requests per 60 seconds per IP.
 */
const rateLimiter = new RateLimiterMemory({ points: 200, duration: 60 });
const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await rateLimiter.consume(req.ip as string | number);
        next();
    } catch (err) {
        res.status(429).json({
            message: "Too many requests. Please try again later.",
        });
    }
};

/**
 * Middleware to sanitize user input in request body.
 * Escapes potentially harmful characters to prevent XSS attacks.
 */
const sanitizeInputMiddleware = (req: Request, res: Response, next: NextFunction) => {
    for (const key in req.body) {
        if (typeof req.body[key] === "string") {
            req.body[key] = validator.escape(req.body[key]);
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
    return helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
        defaultSrc: ["'self'", 'file:'],
        scriptSrc: ["'self'", "'unsafe-inline'", 'file:', stripe[0]],
        connectSrc: ["'self'", stripe[1]],
        frameSrc: ["'self'", stripe[0]], // <-- allow Stripe frames
        },
    });
};

const security = (app: Express) => {
    app.use(helmetContents());        // helmet: sets HTTP headers for basic security
    app.use(hpp());                   // hpp: prevents HTTP parameter pollution
    app.use(mongoSanitize());         // mongoSanitize: removes MongoDB operators from user input
    app.use(rateLimitMiddleware);     // rateLimitMiddleware: limits request rate per IP
    app.use(sanitizeInputMiddleware); // sanitizeInputMiddleware: cleans request body to prevent XSS
};

export default security;