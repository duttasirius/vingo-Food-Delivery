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

// 3 hour 11 min

const app = express();

const server = http.createServer(app);

// socket io instance to create socket io server using node
// socket io server created here
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["POST", "GET"],
  },
});

// Save the Socket.IO server instance in Express app context.
// This allows access to `io` inside any route/controller using `req.app.get("io")`
// Useful for emitting real-time events (e.g., order updates, notifications)
app.set("io", io);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
//Socket.IO  was stored using app.set("io", io)

const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

// this line run the socket io & triggred all function
//socket io run with this func
socketHandler(io);

server.listen(port, () => {
  connectDB();
  console.log(`server started at ${port}`);
});
