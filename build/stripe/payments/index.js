"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = require("../../@utils/cors");
const route_1 = __importDefault(require("./route"));
const endpoints = (app) => {
    app.use('/api/stripe', cors_1.corsPrivate, route_1.default);
};
exports.default = endpoints;
