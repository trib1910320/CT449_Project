const { ObjectId } = require("mongodb");

class ToppingService {
    constructor(client) {
        this.Topping = client.db().collection("toppings");
    }
    extractToppingData(payload) {
        const topping = {
            name: payload.name,
            price: (payload.price) ? parseInt(payload.price) : payload.price,
            date_created: payload.date_created,
        };
        Object.keys(topping).forEach(
            (key) => topping[key] === undefined && delete topping[key]
        );

        return topping;
    }

    async find(filter) {
        const cursor = await this.Topping.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        const cursor = await this.Topping.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Topping.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async create(payload) {
        const topping = this.extractToppingData(payload);

        const result = await this.Topping.findOneAndUpdate(
            topping,
            {
                $set: {
                    date_created: new Date().toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                    }),
                }
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = this.extractToppingData(payload);
        const result = await this.Topping.findOneAndUpdate(
            filter,
            { $set: {
                ...update,
                date_created: new Date().toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                }),
            } },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Topping.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }
}

module.exports = ToppingService;