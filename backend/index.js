import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./utils/sockt.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: frontendUrl,
    credentials: true,
    methods: ["POST", "GET"],
  },
});

app.set("io", io);

// Backend health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vingo backend is running 🚀",
  });
});

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

socketHandler(io);

// Vercel/serverless environments use the exported Express app.
export default app;

// Keep the existing Socket.IO local development server working.
if (process.env.VERCEL !== "1") {
  server.listen(port, () => {
    connectDB();
    console.log(`server started at ${port}`);
  });
} else {
  await connectDB();
}
