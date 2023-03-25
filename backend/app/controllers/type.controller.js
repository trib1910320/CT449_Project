const TypeService = require("../services/type.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const typeService = new TypeService(MongoDB.client);
        const { specific } = req.query;
        const { general } = req.query;
        if (specific) {
            documents = await typeService.findBySpecificName(specific)
        } else if (general) {
            documents = await typeService.findByGeneralName(general)
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
    if (!req.body?.specific_name) {
        return next(new ApiError(400, "Specific name can not be empty"));
    }
    try {
        const typeService = new TypeService(MongoDB.client);
        const document = await typeService.create(req.body);
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the type")
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0 ) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const typeService = new TypeService(MongoDB.client);

        const document = await typeService.update(req.params.id, req.body);
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

        const findTypeInProduct = await productService.findByTypeID(req.params.id);
        if(findTypeInProduct){
            return next(new ApiError(400, "Type cannot be deleted"));
        }

        const document = await typeService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Type not found"));
        }
        return res.send({ message: "Type was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete type with id=${req.params.id}`)
        );
    }
};