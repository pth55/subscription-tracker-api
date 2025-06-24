import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from "../config/env.js";
import {log} from "debug";

if(!DB_URI) {
    throw new Error('MongoDB URI is missing');
}

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to MongoDB in ${NODE_ENV} Mode!`);
    }
    catch(err) {
        console.error("MongoDB connection error", err);
        process.exit(1);
    }
}

export default connectToMongoDB;