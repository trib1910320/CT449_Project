const OrderService = require("../services/order.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const orderService = new OrderService(MongoDB.client);
        const { name } = req.query;
        const { userid } = req.query;
        if (name) {
            documents = await orderService.findByName(name)
        } else if (userid) {
            documents = await orderService.findByUserID(userid)
        } else {
            documents = await orderService.find({});
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the orders")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Order not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving order with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    if (!req.body?.processor) {
        return next(new ApiError(400, "Processor can not be empty"));
    }
    try {
        const OrderItemService = require("../services/orderitem.service");
        const orderItemService = new OrderItemService(MongoDB.client);
        const orderService = new OrderService(MongoDB.client);

        let amount=0;
        for (const id of req.body.order_items) {
            const orderitem = await orderItemService.findById(id);
            amount += orderitem[0].amount;
        }
        console.log(amount);
        const document = await orderService.create({...req.body, amount: amount});
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the order")
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0 ) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const orderService = new OrderService(MongoDB.client);

        const document = await orderService.update(req.params.id, req.body);
            if (!document) {
                return new (ApiError(404, "Order not found"))
            }
        return res.send({ message: "Order was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update order with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);

        const document = await orderService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Order not found"));
        }
        return res.send({ message: "Order was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete order with id=${req.params.id}`)
        );
    }
};