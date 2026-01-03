"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const authentication_1 = require("../../controllers/authentication");
const router = express_1.default.Router();
router.use(authentication_1.protect, (0, authentication_1.restrict)(["admin", "user"]));
router.post('/credit', controller_1.credit);
exports.default = router;
