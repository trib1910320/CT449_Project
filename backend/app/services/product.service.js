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
            price: payload.price,
            created_date: payload.created_date,
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
        const cursor = await this.Product.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.Product.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async findByTypeID(typeid) {
        const result = await this.Product.find({
            _typeid: typeid,
        });
        return await result.toArray();
    }

    async create(payload) {
        const product = this.extractProductData(payload);

        const result = await this.Product.findOneAndUpdate(
            product,
            {
                $set: {
                    created_date: new Date().toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                    }),
                    price: parseInt(payload.price)
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
                    price: parseInt(payload.price)
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