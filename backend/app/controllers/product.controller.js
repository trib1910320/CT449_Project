const ProductService = require("../services/product.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const cloudinary = require('cloudinary').v2;

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const productService = new ProductService(MongoDB.client);
        const { name } = req.query;
        const { typeid } = req.query;
        if (name) {
            documents = await productService.findByName(name)
        } else if (typeid) {
            documents = await productService.findByTypeID(typeid)
        } else {
            documents = await productService.find({});
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the products")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving product with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    try {
        const fileData = req.file;
        if (!req.body?.name && !fileData) {
            return next(new ApiError(400, "Name can not be empty"));
        }
        const productService = new ProductService(MongoDB.client);
        const document = await productService.create({
            ...req.body, path: fileData?.path, filename: fileData?.filename
        });
        return res.send(document);
    } catch (error) {
        if (req.file) cloudinary.uploader.destroy( req.file?.filename) //delete img in cloud
        return next(
            new ApiError(500, "An error occurred while creating the product")
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0 && !(req.file)) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const productService = new ProductService(MongoDB.client);

        const findProduct = await productService.findById(req.params.id);
        if (!findProduct) {
            return next(new ApiError(404, "Product does not exist"));
        }
        
        const fileData = req.file;
        if (fileData) {
            cloudinary.uploader.destroy(findProduct.image.img_name);
            const document = await productService.update(req.params.id, {
                ...req.body, path: fileData.path, filename: fileData.filename
            });
            if (!document) {
                return new (ApiError(404, "Product not found"))
            }
        } else {
            const document = await productService.update(req.params.id, req.body);
            if (!document) {
                return new (ApiError(404, "Product not found"))
            }
        }
        return res.send({ message: "Product was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update product with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const OrderItemService = require("../services/orderitem.service");
        const orderItemService = new OrderItemService(MongoDB.client);
        const productService = new ProductService(MongoDB.client);

        const findProductInOrderI = await orderItemService.findByProductId(req.params.id)
        if(findProductInOrderI){
            return next(new ApiError(400, "Product cannot be deleted"));
        }

        const findProduct = await productService.findById(req.params.id);
        if (!findProduct) {
            return next(new ApiError(404, "Product does not exist"));
        }

        cloudinary.uploader.destroy(findProduct.image?.img_name);
        const document = await productService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Product not found"));
        }
        return res.send({ message: "Product was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete product with id=${req.params.id}`)
        );
    }
};