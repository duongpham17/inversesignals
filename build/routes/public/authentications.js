"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../../controllers/authentication");
const router = express_1.default.Router();
router.get('/load', authentication_1.protect, authentication_1.persist);
router.post('/login', authentication_1.login);
router.post('/signup', authentication_1.signup);
router.post('/reset', authentication_1.reset);
router.post('/forgot', authentication_1.forgot);
exports.default = router;
