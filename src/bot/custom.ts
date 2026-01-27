import dotenv from 'dotenv';
dotenv.config({ path: './config.env'});
import mongoose from 'mongoose';
import Assets from '../models/assets';
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

const custom = async () => {
  console.time("UPDATE");

  await database();

  const assets = await Assets.find()

  customConsoleLog(`TOTAL ASSETS: ${assets.length}`);

  await Promise.all(
    assets.map(async (x) => {
      try {
        const update = {};
        await Assets.updateOne({ _id: x._id }, update);
        customConsoleLog(x.name);
      } catch {
        customConsoleLog(`FAILED ${x.name}`, "red");
      }
    })
  );

  customConsoleLog("ASSETS UPDATED COMPLETED");
   console.timeEnd("UPDATE");
};

//Run only when this file is executed directly
if (require.main === module) custom().catch(console.error);