import mongoose from "mongoose";
const mongoUri =
  process.env.MONGO_URI || "mongodb://localhost:27017/user_role_db";
const connectDB = async () => {
  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};
export default connectDB;
