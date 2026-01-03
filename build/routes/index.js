"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentications_1 = __importDefault(require("./authentications"));
const users_1 = __importDefault(require("./users"));
const scripts_1 = __importDefault(require("./scripts"));
const orders_1 = __importDefault(require("./orders"));
const endpoints = (app) => {
    app.use('/api/authentications', authentications_1.default);
    app.use('/api/users', users_1.default);
    app.use('/api/scripts', scripts_1.default);
    app.use('/api/orders', orders_1.default);
};
exports.default = endpoints;
