
import dotenv from 'dotenv';
dotenv.config();

import mongoose from "mongoose";

// main().catch(err => console.log(err));

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async (db) => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: db });
        console.log('MongoDB connected');
    } catch (error) {
        console.log("MongoDB connection error",error);
    }
}

export default connectDB;
