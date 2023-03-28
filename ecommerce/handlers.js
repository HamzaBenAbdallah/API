import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const { ECOMMERCE_MONGO_URI } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

export const getItems = async (req, res) => {
    const client = new MongoClient(ECOMMERCE_MONGO_URI, options);
    await client.connect();
    const ecommerceData = client.db("ecommerce");
    const itemsData = await ecommerceData.collection("items").find().toArray();

    const itemArrToObj = (arrData, idx) => {
        const result = {};
        arrData.forEach((item) => {
            result[item[idx]] = item;
        });
        return result;
    };

    const items = itemArrToObj(itemsData, "_id");

    if (Object.keys(items).length > 0) {
        return (
            res.status(200).json({
                status: 200,
                items,
                message: "Success",
            }),
            client.close()
        );
    } else {
        return (
            res
                .status(404)
                .json({ status: 404, Message: "No items in database" }),
            client.close()
        );
    }
};

export const getCompanies = async (req, res) => {
    const client = new MongoClient(ECOMMERCE_MONGO_URI, options);
    await client.connect();
    const ecommerceData = client.db("ecommerce");
    const data = await ecommerceData.collection("companies").find().toArray();

    if (data.length > 0) {
        return (
            res.status(200).json({
                status: 200,
                data,
                message: "Success",
            }),
            client.close()
        );
    } else {
        return (
            res
                .status(404)
                .json({ status: 404, Message: "No companies in database" }),
            client.close()
        );
    }
};

export const getProductDescription = async (req, res) => {
    let { product_id } = req.params;
    product_id = parseInt(product_id);
    const client = new MongoClient(ECOMMERCE_MONGO_URI, options);
    await client.connect();
    try {
        const ecommerceData = client.db("ecommerce");
        const specificProduct = await ecommerceData
            .collection("items")
            .find({ _id: product_id })
            .toArray();

        if (specificProduct.length <= 0) {
            res.status(404).json({ Status: 404, Message: "Product not found" });
        } else {
            res.status(200).json({
                status: 200,
                params: product_id,
                Message: `Product ID:${product_id} found`,
                data: specificProduct,
            });
        }
    } catch (err) {
        console.log("error", err);
        res.status(400).json({ Error: err });
    }

    client.close();
};

export const getItemById = async (req, res) => {
    let { item_id } = req.params;
    const id = Number(item_id);
    const client = new MongoClient(ECOMMERCE_MONGO_URI, options);
    await client.connect();
    const db = client.db("ecommerce");
    const itemData = await db.collection("items").findOne({ _id: id });

    if (itemData) {
        return (
            res.status(200).json({
                status: 200,
                item: itemData,
                message: "Success",
            }),
            client.close()
        );
    } else {
        return (
            res.status(404).json({ status: 404, Message: "No item found" }),
            client.close()
        );
    }
};

export const createNewOrder = async (req, res) => {
    try {
        // Connect to the database
        const client = new MongoClient(ECOMMERCE_MONGO_URI, options);
        await client.connect();
        const db = client.db("ecommerce");
        const ordersDb = db.collection("orders");

        // Get the data from the request body
        const { order } = req.body;

        // Update item quantity in the database
        order.itemsData.forEach(async (item) => {
            const itemId = item._id;
            const itemQuantity = item.quantity;
            const itemData = await db
                .collection("items")
                .findOne({ _id: itemId });
            const newQuantity = itemData.numInStock - itemQuantity;
            await db
                .collection("items")
                .updateOne(
                    { _id: itemId },
                    { $set: { numInStock: newQuantity } }
                );
        });

        // Insert the data into the database
        const result = await ordersDb.insertOne(order);

        // Return the result to the client
        return res.status(201).json({
            status: 201,
            message: "Order created",
        });
    } catch (err) {
        res.status(500).json({ status: 500, Error: "Internal server error" });
    }
};

export const getOrder = async (req, res) => {
    try {
        const client = new MongoClient(ECOMMERCE_MONGO_URI, options);
        await client.connect();
        const db = client.db("ecommerce");

        const customerData = await db.collection("orders").find().toArray();

        return (
            res
                .status(200)
                .json({ status: 200, customerData, message: "Order Received" }),
            client.close()
        );
    } catch (err) {
        res.status(404).json({ status: 404, Error: "No purchases made" });
    }
};
