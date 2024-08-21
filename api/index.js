import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/connectDB.js";
// routers
import authRouter from "./routes/auth.route.js";
dotenv.config();
const app = express();
app.use(express.json())
const PORT = 3001;
connectDB();
// sample request
app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
    status: 200,
  });
});
// routing
app.use("/api/auth",authRouter);
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
