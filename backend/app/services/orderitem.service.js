const { ObjectId } = require("mongodb");

class OrderItemService {
    constructor(client) {
        this.OrderItem = client.db().collection("orderitems");
    }
    extractOrderItemData(payload) {
        const orderitem = {
            _productid: payload._productid,
            number: payload.number,
            size: payload.size,
            topping: payload.topping
        };
        Object.keys(orderitem).forEach(
            (key) => orderitem[key] === undefined && delete orderitem[key]
        );

        return orderitem;
    }

    async findById(id) {
        const cursor = await this.OrderItem.aggregate([
            { $addFields: { "_productid": { $toObjectId: "$_productid" } } },
            {
                $lookup: {
                    from: "products",
                    localField: "_productid",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $match: { "_id": new ObjectId(id)  } }
        ]);

        return await cursor.toArray();
    }

    async findAll(filter) {
        const cursor = await this.OrderItem.find(filter);
        return await cursor.toArray();
    }

    async create(payload) {
        const orderItem = this.extractOrderItemData(payload);

        const result = await this.OrderItem.findOneAndUpdate(
            orderItem,
            {
                $set: {
                    number: parseInt(payload.number)
                },
            },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = this.extractOrderItemData(payload);
        const result = await this.OrderItem.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.OrderItem.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }
}

module.exports = OrderItemService;