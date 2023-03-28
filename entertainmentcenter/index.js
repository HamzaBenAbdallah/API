import express from "express";
import movieRouter from "./routes/movies/index.js";
import authRouter from "./routes/auth/index.js";

const entertainmentCenterRouter = express.Router();

// Health Check
entertainmentCenterRouter.get("/", (req, res) => {
    res.send("Welcome to my Entertainment Center API");
});

// Routes Middleware
entertainmentCenterRouter.use("/", movieRouter);
entertainmentCenterRouter.use("/", authRouter);

export default entertainmentCenterRouter;
