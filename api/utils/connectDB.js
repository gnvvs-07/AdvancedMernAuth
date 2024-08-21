import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO)
      .then(() => console.log("DB connected"))
      .catch(() => console.log("DB connection failed"));
  } catch (error) {
    console.error("DB connection error");
  }
};

export default connectDB;
