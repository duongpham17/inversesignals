"use strict";
/* FOR DEVELOPMENT
    
    stripe listen --forward-to localhost:8000/api/webhooks

*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const helper_1 = require("../../@utils/helper");
const _environment_1 = require("../../@environment");
const stripe = new stripe_1.default(_environment_1.stripe_key.key);
exports.paymentIntent = (0, helper_1.asyncBlock)(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, _environment_1.stripe_key.webhook_paymentIntent);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const payment = event.data.object;
            const { id } = payment;
            const { credit, user_id } = payment.metadata;
            try {
                await Promise.all([]);
            }
            catch (err) {
                console.log(err);
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send();
});
