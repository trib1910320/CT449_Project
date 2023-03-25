const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API
    extractUserData(payload) {
        const user = {
            username: payload.username,
            password: payload.password,
            name: payload.name,
            gender: payload.gender,
            email: payload.email,
            phone: payload.phone,
            address: payload.address,
            avatar: {
                avatar_data: payload.path,
                avatar_name: payload.filename
            },
            favorites_list: payload.favorites_list,
            admin: payload.admin,
        };

        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );

        Object.keys(user.avatar).forEach(
            (key) => user.avatar[key] === undefined && delete user.avatar[key]
        );
        if (Object.keys(user.avatar).length == 0) { delete user.avatar }

        return user;
    }

    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.User.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findFavoriteProducts(productId) {
        let result = await this.User.aggregate([
            { $unwind: "$favorites_list" },
            { $match: { favorites_list: productId } }
        ]);
        return result = await result.toArray();
    }

    async findIsFavorite(id, productid) {
        const res = await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            favorites_list: productid ? productid.toString() : null
        });
        return res;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = this.extractUserData(payload);
        const result = await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.User.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }

    async create(payload) {
        const user = this.extractUserData(payload);
        const salt = bcrypt.genSaltSync(10);
        const passwordHashed = bcrypt.hashSync(user.password, salt);
        const defaultAvatar = [
            'https://res.cloudinary.com/duq8p0taa/image/upload/v1679476750/CoffeeShop/Panda_hhvl8s.png'
            , 'https://res.cloudinary.com/duq8p0taa/image/upload/v1679476750/CoffeeShop/Rapid_n3ysvw.png'
            , 'https://res.cloudinary.com/duq8p0taa/image/upload/v1679476750/CoffeeShop/Monster1_bcq8zl.png'
        ]
        const result = await this.User.findOneAndUpdate(
            user,
            {
                $set: {
                    admin: false,
                    password: passwordHashed,
                    online: false,
                    avatar: {
                        avatar_data: defaultAvatar[Math.floor(Math.random() * 3)],
                    }
                }
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }
    async logout(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = { online: false };
        await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
    }

    async favorite(UserID, ProductId) {
        const filter = {
            _id: ObjectId.isValid(UserID) ? new ObjectId(UserID) : null,
        };
        const update = { favorites_list: ProductId };
        const result = await this.User.findOneAndUpdate(
            filter,
            { $push: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async unfavorite(UserID, ProductId) {
        const filter = {
            _id: ObjectId.isValid(UserID) ? new ObjectId(UserID) : null,
        };
        const update = { favorites_list: ProductId };
        const result = await this.User.findOneAndUpdate(
            filter,
            { $pull: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    // Auth
    async login(payload, time) {
        const filter = {
            _id: ObjectId.isValid(payload._id) ? new ObjectId(payload._id) : null,
        };
        const update = { online: true };
        await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );

        return jwt.sign({
            iss: 'Le Duong Tri',
            id: payload._id,
            admin: payload.admin
        }, config.JWT_Secret, {  // secretOrPublicKey mã bí mặt (NodejsApiAuthentication)
            expiresIn: time    // Ngày hết hạn Token 
        })
    }
    async refresh(payload, time) {
        return jwt.sign({
            iss: 'Le Duong Tri',
            id: payload.id,
            admin: payload.admin
        }, config.JWT_Secret, {
            expiresIn: time
        })
    }

    async validPassword(validpassword, password) {
        return await bcrypt.compare(
            validpassword,
            password
        );
    }

    async findUser(payload) {
        if (await this.User.findOne({ username: payload.username })) {
            return "Username already exists in the database"
        }
        if (await this.User.findOne({ email: payload.email })) {
            return "Email already exists in the database"
        }
        if (await this.User.findOne({ phone: payload.phone })) {
            return "Numberphone already exists in the database"
        }
        return null;
    }

}
module.exports = UserService;