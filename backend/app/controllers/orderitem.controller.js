const OrderItemService = require("../services/orderitem.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const orderItemService = new OrderItemService(MongoDB.client);

        documents = await orderItemService.findAll({});
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the orderitems")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const orderItemService = new OrderItemService(MongoDB.client);
        const document = await orderItemService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "OrderItem not found"));
        }
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error retrieving orderitem with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    if (!req.body?.size) {
        return next(new ApiError(400, "Size can not be empty"));
    }
    try {
        const ProductService = require("../services/product.service");
        const ToppingService = require("../services/topping.service");
        const productService = new ProductService(MongoDB.client);
        const toppingService = new ToppingService(MongoDB.client);
        const orderItemService = new OrderItemService(MongoDB.client);


        const product = await productService.findById(req.body._productid);
        let priceSize = 0;
        if (req.body.size == "medium") {
            priceSize = 10000
        } else if (req.body.size == "big") {
            priceSize = 16000
        }

        let priceTopping = 0;
        if (req.body.topping) {
            for (const id of req.body.topping) {
                const topping = await toppingService.findById(id);
                priceTopping += topping.price;
            }
        }

        const document = await orderItemService.create({
            ...req.body, price: (product.price + priceSize + priceTopping)
        });
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the orderitem")
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const ToppingService = require("../services/topping.service");
        const toppingService = new ToppingService(MongoDB.client);
        const orderItemService = new OrderItemService(MongoDB.client);

        const orderItem = await orderItemService.findById(req.params.id);
        let priceSize = 0;
        if (req.body.size == "medium") {
            priceSize = 10000
        } else if (req.body.size == "big") {
            priceSize = 16000
        }

        let priceTopping = 0;
        if (req.body.topping) {
            for (const id of req.body.topping) {
                const topping = await toppingService.findById(id);
                priceTopping += topping.price;
            }
        } else {
            for (const id of orderItem[0].topping) {
                const topping = await toppingService.findById(id);
                priceTopping += topping.price;
            }
        }

        const document = await orderItemService.update(req.params.id,
            { ...req.body, price: (orderItem[0].product.price + priceSize + priceTopping) }
        );
        if (!document) {
            return new ApiError(404, "OrderItem not found")
        }
        return res.send({ message: "OrderItem was update successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error update type with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const orderItemService = new OrderItemService(MongoDB.client);

        const document = await orderItemService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "OrderItem not found"));
        }
        return res.send({ message: "OrderItem was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete orderitem with id=${req.params.id}`)
        );
    }
};

exports.deleteMany = async (req, res, next) => {
    if((req.body.order_items).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const orderItemService = new OrderItemService(MongoDB.client);
        for (const id of req.body.order_items) {
            const document = await orderItemService.delete(id);
            if (!document) {
                return next(new ApiError(404, `OrderItem not found with id=${id}`));
            }
        }

        return res.send({ message: "OrderItems was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, 'Could not delete orderitems')
        );
    }
};