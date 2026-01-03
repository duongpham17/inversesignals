"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../@utils/helper");
const private_1 = __importDefault(require("../routes/private"));
const public_1 = __importDefault(require("../routes/public"));
const admin_1 = __importDefault(require("../routes/admin"));
//import Stripe from '../stripe/payments';
const routes = (app) => {
    (0, public_1.default)(app);
    (0, private_1.default)(app);
    (0, admin_1.default)(app);
    //Stripe(app);
    app.use(helper_1.errorMessage);
};
exports.default = routes;
