"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongodb = exports.whitelist = exports.development_url = exports.production_url = exports.website = exports.environment = void 0;
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
