const ToppingService = require("../services/topping.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const toppingService = new ToppingService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await toppingService.findByName(name)
        } else {
            documents = await toppingService.find({});
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the toppings")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const toppingService = new ToppingService(MongoDB.client);
        const document = await toppingService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Topping not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving topping with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    if (!req.body?.price) {
        return next(new ApiError(400, "Price can not be empty"));
    }
    try {
        const toppingService = new ToppingService(MongoDB.client);
        const document = await toppingService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the topping")
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const toppingService = new ToppingService(MongoDB.client);
        const findTopping = await toppingService.findByName(req.body.name);
        if (findTopping.length != 0)
            return next(new ApiError(400, "Topping Name already exists."));

        const document = await toppingService.update(req.params.id, req.body);
        if (!document) {
            return new (ApiError(404, "Topping not found"))
        }
        return res.send({ message: "Topping was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update topping with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const OrderItemService = require("../services/orderitem.service");
        const orderItemService = new OrderItemService(MongoDB.client);
        const toppingService = new ToppingService(MongoDB.client);

        const findOrderItem = await orderItemService.find({});


        const document = await toppingService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Topping not found"));
        }
        return res.send({ message: "Topping was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete topping with id=${req.params.id}`)
        );
    }
};