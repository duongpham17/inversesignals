import dotenv from 'dotenv';
dotenv.config({ path: './config.env'});
import mongoose from 'mongoose';
import Assets from '../models/assets';
import { apis } from './apis';
import { mongodb } from '../@environment';

const database = async () => {
  if (mongoose.connection.readyState === 1) return;
  const dbUri = mongodb.database.replace('<password>', encodeURIComponent(mongodb.password));
  mongoose.set('strictQuery', true);
  await mongoose.connect(dbUri);
  console.log("DB connected!");
};

const Color = { green: "\x1b[32m%s\x1b[0m", red: "\x1b[31m%s\x1b[0m", blue: "\x1b[34m%s\x1b[0m"}
type TColor = keyof typeof Color
const customConsoleLog = (message: string, color="green") => {
  console.log("-------------------------------------------------------");
  console.log(Color[color as TColor], message);
};

const collect = async () => {
  console.time("collect");

  await database();
  const assets = await Assets.find().lean();
  type TApiKey = keyof typeof apis;
  customConsoleLog(`TOTAL ASSETS: ${assets.length}`);
  await Promise.all(
    assets.map( async (x) => {
        if(!x.api) return;
        try {
          const [h1, h4, d1, w1] = await Promise.all([
            apis[x.api as TApiKey](x.ticker, "1h"),
            apis[x.api as TApiKey](x.ticker, "4h"),
            apis[x.api as TApiKey](x.ticker, "1d"),
            apis[x.api as TApiKey](x.ticker, "1w"),
          ]);
          const slice = -100;
          const update = { dataset_1h: h1.slice(slice), dataset_4h: h4.slice(slice), dataset_1d: d1.slice(slice), dataset_1w: w1.slice(slice) }
          await Assets.updateOne({_id: x._id}, update);
          customConsoleLog(`${x.name}`)
        } catch(err: any){
          customConsoleLog(`FAILED ${x.name}`, "red");
        }
    })
  );
  customConsoleLog("ASSET UPDATED COMPLETED");
  console.timeEnd("collect");
};

//Run only when this file is executed directly
if (require.main === module) collect().catch(console.error);

const minutes = 60_000 * 5;

export default () => setInterval(() => collect(), minutes);