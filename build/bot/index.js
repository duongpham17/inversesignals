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
const [minutes, delay] = [(60_000 * 1), (60_000 * 5)];
const collect = async () => {
    console.time("UPDATED");
    await database();
    const threshold = Date.now() - (minutes + delay);
    const assets = await assets_1.default.find({
        updatedAt: { $lt: threshold },
        api: { $exists: true }
    }).lean();
    customConsoleLog(`TOTAL ASSETS: ${assets.length}`);
    let [crypto_count, stock_count] = [0, 0];
    await Promise.all(assets.map(async (x) => {
        try {
            const [m5, h1, h4, d1] = await Promise.all([
                apis_1.apis[x.api](x.ticker, "5m"),
                apis_1.apis[x.api](x.ticker, "1h"),
                apis_1.apis[x.api](x.ticker, "4h"),
                apis_1.apis[x.api](x.ticker, "1d"),
            ]);
            const update = {
                dataset_5m: m5.slice(-100),
                dataset_1h: h1.slice(-100),
                dataset_4h: h4.slice(-100),
                dataset_1d: d1.slice(-100),
                updatedAt: Date.now()
            };
            if (x.class === "crypto")
                crypto_count++;
            if (x.class === "stock")
                stock_count++;
            await assets_1.default.updateOne({ _id: x._id }, update);
        }
        catch {
            customConsoleLog(`FAILED ${x.name}`, "red");
        }
    }));
    const date = new Date().toISOString();
    console.log(`${date} Stock:${stock_count} Crypto:${crypto_count} Updated:${crypto_count + stock_count}/${assets.length}`);
    console.timeEnd("UPDATED");
};
//Run only when this file is executed directly
if (require.main === module)
    collect().catch(console.error);
exports.default = () => setInterval(() => collect(), minutes);
