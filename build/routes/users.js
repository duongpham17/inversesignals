"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../controllers/authentication");
const users_1 = require("../controllers/users");
const router = express_1.default.Router();
router.use(authentication_1.protect, (0, authentication_1.restrict)(["admin", "user"]));
router.get('/', users_1.find);
router.post('/', users_1.create);
router.patch('/', users_1.update);
router.delete('/:id', users_1.remove);
exports.default = router;
