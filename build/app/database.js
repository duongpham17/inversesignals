"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const _environment_1 = require("../@environment");
const database = async () => {
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            console.log("Reused existing database connection!");
            return;
        }
        const dbUri = _environment_1.mongodb.database.replace('<password>', encodeURIComponent(_environment_1.mongodb.password));
        mongoose_1.default.set('strictQuery', true);
        await mongoose_1.default.connect(dbUri);
        const development = process.env.NODE_ENV === "development";
        if (development)
            console.log("DB connection successful!");
    }
    catch (err) {
        console.error("Could not connect to database", err);
    }
};
exports.default = database;
