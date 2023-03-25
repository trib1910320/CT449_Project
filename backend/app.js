require ('dotenv').config()

const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const auth = require("./app/middlewares/auth");
const usersRouter = require("./app/routes/user.route");
const authRouter = require("./app/routes/auth.route");
const productsRouter = require("./app/routes/product.route");
const typesRouter = require("./app/routes/type.route");
const toppingsRouter = require("./app/routes/topping.route");
const ordersRouter = require("./app/routes/order.route");
const orderitemsRouter = require("./app/routes/orderitem.route");

const app = express();
const cookieParser = require('cookie-parser');

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to coffee shop application." });
});

app.use("/api/auth", authRouter);
app.use("/api/orderitems",orderitemsRouter);
app.use("/api/products",productsRouter);
app.use("/api/types",typesRouter);
app.use("/api/toppings",toppingsRouter);
app.use("/api/users",auth.verifyToken ,usersRouter);
app.use("/api/orders",auth.verifyToken ,ordersRouter);

// handle 404 response 
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

//define error-handling middleware last, after other app.use() and routes calls 
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({ 
        message: error.message || "Internal Server Error", 
    });
});

module.exports = app;
