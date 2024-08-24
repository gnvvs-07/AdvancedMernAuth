import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB.js";
import authRouter from "./routes/auth.route.js";
dotenv.config();
// express app
const app = express();
// middlewares
app.use(express.json());
app.use(cookieParser());
// db connection
connectDB();
// routing
app.use("/api/auth", authRouter);
// port assignment
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
