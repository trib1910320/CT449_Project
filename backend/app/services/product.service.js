const { ObjectId } = require("mongodb");

class ProductService {
    constructor(client) {
        this.Product = client.db().collection("products");
    }
    extractProductData(payload) {
        const product = {
            name: payload.name,
            image: {
                img_data: payload.path,
                img_name: payload.filename
            },
            describe: payload.describe,
            price: (payload.price) ? parseInt(payload.price) : payload.price,
            date_created: payload.date_created,
            _typeid: payload._typeid
        };
        Object.keys(product).forEach(
            (key) => product[key] === undefined && delete product[key]
        );

        Object.keys(product.image).forEach(
            (key) => product.image[key] === undefined && delete product.image[key]
        );
        if (Object.keys(product.image).length == 0) { delete product.image };

        return product;
    }

    async find(filter) {
        const cursor = await this.Product.find(filter).sort({ "date_created": -1 });
        return await cursor.toArray();
    }

    async findLimit(filter) {
        const cursor = await this.Product.find(filter).sort({ "date_created": -1 }).limit(5);
        return await cursor.toArray();
    }

    async findByName(name) {
        const cursor = await this.Product.find({
            name: { $regex: new RegExp(name)},
        });
        return await cursor.toArray();
    }

    async findByTypeId(typeid) {
        const cursor = this.Product.find({
            _typeid: typeid ? typeid.toString() : null
        });
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async create(payload) {
        const product = this.extractProductData(payload);

        const result = await this.Product.findOneAndUpdate(
            product,
            {
                $set: {
                    date_created: new Date().toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                    })
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
        const update = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            filter,
            {
                $set: {
                    ...update,
                    date_created: new Date().toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                    }),
                }
            },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }
}

module.exports = ProductService;