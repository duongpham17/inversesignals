"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../../controllers/authentication");
const trades_1 = require("../../controllers/trades");
const router = express_1.default.Router();
router.use(authentication_1.protect, (0, authentication_1.restrict)(["admin", "user"]));
router.get('/', trades_1.find);
router.post('/', trades_1.create);
router.patch('/', trades_1.update);
router.delete('/:id', trades_1.remove);
router.get('/:id', trades_1.open);
exports.default = router;
