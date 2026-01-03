"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = require("../../@utils/cors");
const authentications_1 = __importDefault(require("./authentications"));
const assets_1 = __importDefault(require("./assets"));
const endpoints = (app) => {
    app.use('/api/authentications', cors_1.corsPublic, authentications_1.default);
    app.use('/api/assets', cors_1.corsPublic, assets_1.default);
};
exports.default = endpoints;
