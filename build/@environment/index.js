"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe_key = exports.mongodb = exports.whitelist = exports.development_url = exports.production_url = exports.website = exports.environment = void 0;
exports.environment = process.env.NODE_ENV;
exports.website = {
    name: "inverse signals",
    Name: "Inverse Signals"
};
exports.production_url = [
    "https://inversesignals.onrender.com"
];
exports.development_url = [
    'http://localhost:3000'
];
exports.whitelist = exports.environment === 'production'
    ? exports.production_url
    : exports.development_url;
exports.mongodb = {
    database: process.env.DATABASE,
    password: process.env.DATABASE_PASSWORD
};
exports.stripe_key = {
    key: exports.environment === "production" ? process.env.STRIPE_PROD_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY,
    webhook_paymentIntent: exports.environment === "production" ? process.env.STRIPE_PROD_WEBHOOK_SECRET : process.env.STRIPE_TEST_WEBHOOK_SECRET,
};
