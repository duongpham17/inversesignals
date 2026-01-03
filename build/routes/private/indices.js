"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../../controllers/authentication");
const indicies_1 = require("../../controllers/indicies");
const router = express_1.default.Router();
router.use(authentication_1.protect, (0, authentication_1.restrict)(["admin", "user"]));
router.get('/', indicies_1.find);
router.post('/', indicies_1.create);
router.patch('/', indicies_1.update);
router.delete('/:id', indicies_1.remove);
exports.default = router;
