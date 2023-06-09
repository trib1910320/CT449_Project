const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const config = require("../config");
const cloudinary = require('cloudinary').v2;

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const userService = new UserService(MongoDB.client);
        const { name, phone } = req.query;
        if (phone) {
            documents = await userService.findUserByPhone(phone);
        } else if (name) {
            documents = await userService.findByName(name);
        } else {
            documents = await userService.find({});
        }
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the users")
        );
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving user with id=${req.params.id}`)
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0 && !(req.file)) {
        return next(ApiError(400, "Data to update can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);

        const fileData = req.file;
        if (fileData) {
            cloudinary.uploader.destroy(findUser.avatar.avatar_name);
            const document = await userService.update(req.params.id, {
                ...req.body, path: fileData.path, filename: fileData.filename
            });
            if (!document) {
                return next(new ApiError(404, "User not found"))
            }
        } else {
            const document = await userService.update(req.params.id, req.body);
            if (!document) {
                return next(new ApiError(404, "User not found"))
            }
        }
        return res.send({ message: "User was update successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error update user with id=${req.params.id}`)
        );
    }
};

exports.delete = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User not found"));
        }
        return res.send({ message: "User was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete user with id=${req.params.id}`)
        );
    }
};

exports.logOut = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        await userService.logout(req.user.id);
        res.clearCookie("refreshToken");
        res.send({ message: "Log Out" });
        res.end();
    } catch (error) {
        return next(
            new ApiError(500, `Error logout user with id=${req.user.id}`)
        );
    }
};
// Auth Route
exports.register = async (req, res, next) => {
    if (!req.body?.phone) {
        return next(new ApiError(400, "Numberphone can not be empty"));
    } else if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const findUser = await userService.findUserByPhone(req.body.phone);
        if (findUser) {
            return next(new ApiError(400, "User already exists"));
        }
        const document = await userService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
}

exports.login = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findUserByPhone(req.body.phone);

        if (!user) return next(new ApiError(404, "Wrong numberphone"));

        const validPassword = await userService.validPassword(req.body.password, user.password)
        if (!validPassword) return next(new ApiError(404, "Wrong password"));
        if (user && validPassword) {
            const accessToken = await userService.login(user, "2h");
            const refreshToken = await userService.login(user, "1d");
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            return res.send({
                userid: user._id,
                admin: user.admin,
                AccessToken: accessToken
            });
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while logging the user")
        );
    }
}

exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return next(
        new ApiError(401, "You're not authenticated")
    );
    const userService = new UserService(MongoDB.client);
    jwt.verify(refreshToken, config.JWT_Secret, async (error, user) => {
        if (error) return next(
            new ApiError(401, "Token is not valid")
        );
        const newAccessToken = await userService.refresh(user, "2h");
        const newRefreshToken = await userService.refresh(user, "1d");
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
        });

        return res.send({
            userid: user.id,
            admin: user.admin,
            AccessToken: newAccessToken
        });
    })
}
