const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const userService = new UserService(MongoDB.client);
        const { name } = req.query;
        if (name) {
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
                return new (ApiError(404, "User not found"))
            }
        } else {
            const document = await userService.update(req.params.id, req.body);
            if (!document) {
                return new (ApiError(404, "User not found"))
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

exports.favoriteProducts = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.findById(req.user.id);
        if (!document) {
            return next(new ApiError(404, "Favorite products not found"));
        }
        return res.send(document.favorites_list);
    } catch (error) {
        return next(
            new ApiError(500, 'An error occurred while retrieving the favorite products')
        );
    }
};

exports.favorite = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);

        const findIsFavorite = await userService.findIsFavorite(req.user.id, req.body.productid);
        if (findIsFavorite) {
            return next(new ApiError(404, "Product already exists in favorites list"));
        }

        const document = await userService.favorite(req.user.id, req.body.productid);
        if (!document) {
            return next(new ApiError(404, "Favorite products not found"))
        }

        return res.send({ message: "Product was favorite successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error favorite product with id=${req.body.productid}`)
        );
    }
};

exports.unfavorite = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);

        const findIsFavorite = await userService.findIsFavorite(req.user.id, req.body.productid);
        if (!findIsFavorite) {
            return next(new ApiError(404, "Product does not exist in favorites list"));
        }

        const document = await userService.unfavorite(req.user.id, req.body.productid);
        if (!document) {
            return next(new ApiError(404, "Favorite products not found"))
        }

        return res.send({ message: "Product was unfavorite successfully" });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error unfavorite product with id=${req.body.productid}`)
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
    if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"));
    } else if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }
    try {
        const userService = new UserService(MongoDB.client);
        const findUser = await userService.findUser(req.body);
        if (findUser) {
            return next(new ApiError(404, findUser));
        } else {
            const document = await userService.create(req.body);
            return res.send(document);
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the user")
        );
    }
}

exports.login = async (req, res, next) => {
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findByUsername(req.body.username);

        if (!user) return next(new ApiError(404, "Wrong username"));

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
                AccessToken: accessToken
            });
        }
    } catch (error) {
        console.log(error);
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
            AccessToken: newAccessToken
        });
    })
}
