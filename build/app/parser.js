"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // import express itself and the type
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const parser = (app) => {
    // Parse JSON bodies up to 100kb
    app.use(express_1.default.json({ limit: '100kb' }));
    // Parse URL-encoded bodies (form submissions)
    app.use(express_1.default.urlencoded({ extended: true }));
    // Parse cookies from incoming requests
    app.use((0, cookie_parser_1.default)());
};
exports.default = parser;
