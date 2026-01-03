"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = exports.email_password = exports.email_address = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.email_address = process.env.EMAIL_ADDRESS;
exports.email_password = process.env.EMAIL_PASSWORD;
const Email = () => nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: exports.email_address,
        pass: exports.email_password,
    },
});
exports.Email = Email;
