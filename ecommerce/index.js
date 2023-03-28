import express from "express";
import {
    createNewOrder,
    getItems,
    getProductDescription,
    getOrder,
} from "./handlers.js";

const ecommerceRouter = express.Router();

// Health Check
ecommerceRouter.get("/", (req, res) => {
    res.send("Welcome to my Ecommerce API");
});

// Routes
ecommerceRouter.get("/get-items", getItems);
ecommerceRouter.get("/products/:product_id", getProductDescription);
ecommerceRouter.post("/checkout", createNewOrder);
ecommerceRouter.get("/confirmed-purchased", getOrder);

export default ecommerceRouter;
