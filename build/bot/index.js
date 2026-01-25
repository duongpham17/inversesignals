"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './config.env' });
const mongoose_1 = __importDefault(require("mongoose"));
const assets_1 = __importDefault(require("../models/assets"));
const apis_1 = require("./apis");
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
const [minutes, delay] = [60_000 * 1, 60_000 * 5];
const collect = async () => {
    console.time("collecting");
    await database();
    const threshold = Date.now() - (minutes + delay);
    const assets = await assets_1.default.find({
        updatedAt: { $lt: threshold },
        api: { $exists: true }
    }).lean();
    customConsoleLog(`TOTAL ASSETS: ${assets.length}`);
    await Promise.all(assets.map(async (x) => {
        try {
            const [h1, h4, d1, w1] = await Promise.all([
                apis_1.apis[x.api](x.ticker, "1h"),
                apis_1.apis[x.api](x.ticker, "4h"),
                apis_1.apis[x.api](x.ticker, "1d"),
                apis_1.apis[x.api](x.ticker, "1w"),
            ]);
            const update = {
                dataset_1h: h1.slice(-100),
                dataset_4h: h4.slice(-100),
                dataset_1d: d1.slice(-100),
                dataset_1w: w1.slice(-100),
                updatedAt: Date.now()
            };
            await assets_1.default.updateOne({ _id: x._id }, update);
            customConsoleLog(x.name);
        }
        catch {
            customConsoleLog(`FAILED ${x.name}`, "red");
        }
    }));
    customConsoleLog("ASSET UPDATED COMPLETED");
    console.timeEnd("collecting");
};
//Run only when this file is executed directly
if (require.main === module)
    collect().catch(console.error);
exports.default = () => setInterval(() => collect(), minutes);
