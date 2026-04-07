import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import foodRouter from "./routes/foodRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// Load env
configDotenv();

// App setup
const app = express();
const PORT = process.env.PORT || 4000;

// DB connection
connectDB();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      process.env.ADMIN_URL || "http://localhost:5174",
    ],
    credentials: true,
  })
);

// Static uploads folder
app.use("/images", express.static("uploads"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "🍕 FoodieHub API is running!",
    version: "1.0.0",
    status: "healthy",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 FoodieHub Server running on http://localhost:${PORT}`);
});
