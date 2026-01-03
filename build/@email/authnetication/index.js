"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmail = exports.Forgot = exports.Signin = exports.Signup = void 0;
const index_1 = require("../index");
const template_1 = require("./template");
;
const Signup = async (data) => {
    const transporter = (0, index_1.Email)();
    const mailOptions = {
        from: `${index_1.email_address} <${index_1.email_address}>`,
        to: data.email,
        subject: "Confirm Email",
        html: (0, template_1.AUTHENTICATION)(data)
    };
    await transporter.sendMail(mailOptions);
};
exports.Signup = Signup;
const Signin = async (data) => {
    const transporter = (0, index_1.Email)();
    const mailOptions = {
        from: `${index_1.email_address} <${index_1.email_address}>`,
        to: data.email,
        subject: `Login Code: ${data.token}`,
        html: (0, template_1.AUTHENTICATION)(data)
    };
    await transporter.sendMail(mailOptions);
};
exports.Signin = Signin;
const Forgot = async (data) => {
    const transporter = (0, index_1.Email)();
    const mailOptions = {
        from: `${index_1.email_address} <${index_1.email_address}>`,
        to: data.email,
        subject: `Forgot Password Code`,
        html: (0, template_1.AUTHENTICATION)(data)
    };
    await transporter.sendMail(mailOptions);
};
exports.Forgot = Forgot;
const VerifyEmail = async (data) => {
    const transporter = (0, index_1.Email)();
    const mailOptions = {
        from: `${index_1.email_address} <${index_1.email_address}>`,
        to: data.email,
        subject: `Verify Email ${data.token}`,
        html: (0, template_1.AUTHENTICATION)(data)
    };
    await transporter.sendMail(mailOptions);
};
exports.VerifyEmail = VerifyEmail;
