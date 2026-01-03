import mongoose from 'mongoose';
import { mongodb } from '../@environment';

const database = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Reused existing database connection!");
      return;
    }

    const dbUri = mongodb.database.replace('<password>', encodeURIComponent(mongodb.password));

    mongoose.set('strictQuery', true);

    await mongoose.connect(dbUri);

    const development = process.env.NODE_ENV === "development";
    if (development) console.log("DB connection successful!");
  } catch (err) {
    console.error("Could not connect to database", err);
  }
};

export default database;
