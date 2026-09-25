import express from "express";
import cookieParser from "cookie-parser";

import healthRouter from "./routes/health";
import authTestRouter from "./routes/auth-test";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/health", healthRouter);
app.use("/api/auth/test", authTestRouter);

export default app;