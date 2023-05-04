const { ObjectId } = require("mongodb");

class OrderItemService {
    constructor(client) {
        this.OrderItem = client.db().collection("orderitems");
    }
    extractOrderItemData(payload) {
        const orderitem = {
            _productid: payload._productid,
            quantity: payload.quantity,
            size: payload.size,
            total_amount: payload.total_amount,
            topping: payload.topping,
            date_created: payload.date_created
        };
        Object.keys(orderitem).forEach(
            (key) => orderitem[key] === undefined && delete orderitem[key]
        );

        return orderitem;
    }

    async findByProductId(productid) {
        const cursor = await this.OrderItem.find({
            _productid: productid ? productid.toString() : null
        });
        return await cursor.toArray();
    }

    async findAll(filter) {
        const cursor = await this.OrderItem.find(filter);
        return await cursor.toArray();
    }

    async findById(id) {
        const cursor = await this.OrderItem.aggregate([
            { $match: { "_id": ObjectId.isValid(id) ? new ObjectId(id) : null } },
            { $addFields: { "_productid": { $toObjectId: "$_productid" } } },
            {
                $lookup: {
                    from: "products",
                    localField: "_productid",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" }
        ]);

        return await cursor.toArray();
    }

    async create(payload) {
        const orderItem = this.extractOrderItemData({
            ...payload,
            date_created: new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
            })
        });
        
        const result = await this.OrderItem.findOneAndUpdate(
            orderItem,
            {
                $set: {
                    quantity: parseInt(payload.quantity),
                    total_amount: (parseInt(payload.quantity) * payload.price)
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
        const update = this.extractOrderItemData(payload);
        const result = await this.OrderItem.findOneAndUpdate(
            filter,
            {
                $set: {
                    ...update,
                    quantity: parseInt(payload.quantity),
                    total_amount: (parseInt(payload.quantity) * payload.price),
                }
            },
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