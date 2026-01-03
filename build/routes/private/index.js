"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = require("../../@utils/cors");
const users_1 = __importDefault(require("./users"));
const indices_1 = __importDefault(require("./indices"));
const trades_1 = __importDefault(require("./trades"));
const endpoints = (app) => {
    app.use('/api/users', cors_1.corsPrivate, users_1.default);
    app.use('/api/indices', cors_1.corsPrivate, indices_1.default);
    app.use('/api/trades', cors_1.corsPrivate, trades_1.default);
};
exports.default = endpoints;
