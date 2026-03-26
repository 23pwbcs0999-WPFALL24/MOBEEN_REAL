import mongoose from "mongoose";

let isConnected = false;
let connectionPromise = null;

export const connectDB = async () => {
  try {
    if (isConnected || mongoose.connection.readyState === 1) {
      isConnected = true;
      return;
    }

    if (connectionPromise) {
      await connectionPromise;
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Create server/.env from server/.env.example.");
    }

    connectionPromise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000
      })
      .then(() => {
        isConnected = true;
      })
      .finally(() => {
        connectionPromise = null;
      });

    await connectionPromise;
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};
