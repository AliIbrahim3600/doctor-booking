import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Doctor from "./models/Doctor";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/doctor_booking";

async function approveAll() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");
    
    const result = await Doctor.updateMany({}, { isApproved: true });
    console.log(`Approved ${result.modifiedCount} doctors (out of ${result.matchedCount} total).`);
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error approving doctors:", error);
    process.exit(1);
  }
}

approveAll();
