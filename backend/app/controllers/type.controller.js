const TypeService = require("../services/type.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const cloudinary = require('cloudinary').v2;

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const typeService = new TypeService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await typeService.findByName(name)
        } else {
            documents = await typeService.find({});
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the types")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const typeService = new TypeService(MongoDB.client);
        const document = await typeService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Type not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving type with id=${req.params.id}`)
        );
    }
};

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }
    try {
        const fileData = req.file;
        const typeService = new TypeService(MongoDB.client);
        const document = await typeService.create({
            ...req.body, path: fileData?.path, filename: fileData?.filename
        });
        return res.send(document);
    } catch (error) {
        if (req.file) cloudinary.uploader.destroy(req.file?.filename) //delete img in cloud
        return next(
            new ApiError(500, "An error occurred while creating the type")
        );
    }
};

exports.update = async (req, res, next) => {

    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const typeService = new TypeService(MongoDB.client);

        const fileData = req.file;
        let document;
        if (fileData) {
            cloudinary.uploader.destroy(findProduct.image.img_name);
            document = await typeService.update(req.params.id, {
                ...req.body, path: fileData.path, filename: fileData.filename
            });
        } else {
            document = await typeService.update(req.params.id, req.body);
        }
        if (!document) {
            return new (ApiError(404, "Type not found"))
        }
        return res.send({ message: "Type was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update type with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const ProductService = require("../services/product.service");
        const productService = new ProductService(MongoDB.client);
        const typeService = new TypeService(MongoDB.client);

        const findType = await typeService.findById(req.params.id);
        if (!findType) {
            return next(new ApiError(404, "Type does not exist"));
        }

        const findTypeInProduct = await productService.findByTypeId(req.params.id);
        if (findTypeInProduct != 0) {
            return next(new ApiError(405, "Type cannot be deleted"));
        }

        cloudinary.uploader.destroy(findType.image?.img_name);
        await typeService.delete(req.params.id);

        return res.send({ message: "Type was deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Could not delete type with id=${req.params.id}`)
        );
    }
};