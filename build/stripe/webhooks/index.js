"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = __importDefault(require("./route"));
const endpoints = (app) => {
    app.use('/api/webhooks', route_1.default);
};
exports.default = endpoints;
