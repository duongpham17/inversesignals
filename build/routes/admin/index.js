"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = require("../../@utils/cors");
const assets_1 = __importDefault(require("./assets"));
const endpoints = (app) => {
    app.use('/api/admin/assets', cors_1.corsPrivate, assets_1.default);
};
exports.default = endpoints;
