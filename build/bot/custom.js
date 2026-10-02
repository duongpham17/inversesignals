"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const mongoose_1 = __importDefault(require("mongoose"));
const assets_1 = __importDefault(require("../models/assets"));
const _environment_1 = require("../@environment");
const database = async () => {
    if (mongoose_1.default.connection.readyState === 1)
        return;
    const dbUri = _environment_1.mongodb.database.replace('<password>', encodeURIComponent(_environment_1.mongodb.password));
    mongoose_1.default.set('strictQuery', true);
    await mongoose_1.default.connect(dbUri);
    console.log("DB connected!");
};
const Color = { green: "\x1b[32m%s\x1b[0m", red: "\x1b[31m%s\x1b[0m", blue: "\x1b[34m%s\x1b[0m" };
const customConsoleLog = (message, color = "green") => {
    console.log("-------------------------------------------------------");
    console.log(Color[color], message);
};
const custom = async () => {
    console.time("UPDATE");
    await database();
    const assets = await assets_1.default.find();
    customConsoleLog(`TOTAL ASSETS: ${assets.length}`);
    await Promise.all(assets.map(async (x) => {
        try {
            const update = {};
            // await Assets.updateOne({ _id: x._id }, update); //update object with a new key
            //await Assets.updateOne({_id: x._id}, { $unset: { dataset_1w: 1}}); // delete a key: NOTE KEY must exist in model before running
            customConsoleLog(x.name);
        }
        catch {
            customConsoleLog(`FAILED ${x.name}`, "red");
        }
    }));
    console.timeEnd("UPDATE");
};
//Run only when this file is executed directly
if (require.main === module)
    custom().catch(console.error);
