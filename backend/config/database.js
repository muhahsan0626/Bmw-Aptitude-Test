import 'dotenv/config';
import mongoose from 'mongoose';

export const connectDatabase = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("MongoDB URI not found in environment variables.");
        process.exit(1); // Exit process if URI is not set
    }

    try {
        await mongoose.connect(uri);
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1); // Exit the process on failure
    }
};