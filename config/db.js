import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database Connected Successfully');
  } catch (err) {
    console.log('❌ Database Connection error', err);
  }
};

export default connectDb;