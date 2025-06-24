import express from "express";
import cookieParser from "cookie-parser";
import {PORT} from "./config/env.js"
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/users.routes.js";
import subsRouter from "./routes/subs.router.js";
import connectToMongoDB from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(arcjetMiddleware); // for rate limiting, bot protection etc..

// /api/v1/
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subs", subsRouter);
app.use("/api/v1/workflows", workflowRouter);
app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("Subscription Tracker API!!");
});

app.listen(PORT, async () => {
    console.log(`Listening on port http://localhost:${PORT}`);

    await connectToMongoDB();
});

