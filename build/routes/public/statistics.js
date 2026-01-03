"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statistics_1 = require("../../controllers/statistics");
const router = express_1.default.Router();
router.get('/', statistics_1.get);
router.post('/', statistics_1.download);
exports.default = router;
