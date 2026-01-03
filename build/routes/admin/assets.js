"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../../controllers/authentication");
const assets_1 = require("../../controllers/assets");
const router = express_1.default.Router();
router.use(authentication_1.protect, (0, authentication_1.restrict)(["admin"]));
router.get('/', assets_1.find);
router.post('/', assets_1.create);
router.patch('/', assets_1.update);
router.get('/select', assets_1.findSelect);
router.delete('/:id', assets_1.remove);
router.get('/:id', assets_1.findId);
exports.default = router;
