// getting-started.js
// const mongoose = require('mongoose');

import mongoose from "mongoose";

// main().catch(err => console.log(err));

const MONGO_URI = "mongodb+srv://himsignum:4kJzaZpUEZxBaNEO@mongotest.r1l802q.mongodb.net/";

const connectDB = async (db) => {
    try {
        await mongoose.connect(MONGO_URI, { dbName: db });
        console.log('MongoDB connected');
    } catch (error) {
        console.log("MongoDB connection error",error);
    }
}

export default connectDB;
