import express from "express";
import morgan from "morgan";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 3001;

//Import Routes
import ecommerceRouter from "./ecommerce/index.js";
import entertainmentCenterRouter from "./entertainmentcenter/index.js";

const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors
const corsOptions = {
    exposedHeaders: ["auth-token"],
};
app.use(cors(corsOptions));

// Health Check
app.get("/", (req, res) => {
    res.send("Welcome to my API");
});

// Routes
app.use("/ecommerce", ecommerceRouter);
app.use("/entertainmentcenter", entertainmentCenterRouter);

// Error Handling
app.get("*", (req, res) => {
    res.status(404).json({
        status: 404,
        message: "Page not found",
    });
});

app.listen(PORT);
