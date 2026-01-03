"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.credit = void 0;
const stripe_1 = __importDefault(require("stripe"));
const _environment_1 = require("../../@environment");
const helper_1 = require("../../@utils/helper");
const stripe = new stripe_1.default(_environment_1.stripe_key.key);
exports.credit = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const { credit } = req.body;
    if (!credit || typeof credit !== 'number' || credit <= 0 || !Number.isInteger(credit)) {
        return res.status(400).json({ status: 'fail', message: 'Invalid credit amount' });
    }
    ;
    const cost = 5;
    const paymentIntent = await stripe.paymentIntents.create({
        automatic_payment_methods: { enabled: true },
        amount: Number(credit) * (cost * 100), // has to be in pennies
        currency: 'gbp',
        metadata: {
            credit: credit.toString(),
            user_id: req.user._id.toString(),
            email: req.user.email,
            total: Number(credit) * cost,
        },
    });
    return res.status(200).json({
        status: 'success',
        clientSecret: paymentIntent.client_secret,
    });
});
