const { ObjectId } = require("mongodb");

class OrderService {
    constructor(client) {
        this.Order = client.db().collection("orders");
    }
    extractOrderData(payload) {
        const order = {
            _userid: payload._userid,
            status: payload.status,
            processor: payload.processor,
            total_amount: payload.total_amount,
            receiver: {
                name: payload.name,
                phone: payload.phone,
                address: payload.address,
            },
            note: payload.note,
            order_items: payload.order_items,
            created_date: payload.created_date,
        };
        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        );

        Object.keys(order.receiver).forEach(
            (key) => order.receiver[key] === undefined && delete order.receiver[key]
        );
        if (Object.keys(order.receiver).length == 0) { delete order.receiver };

        return order;
    }

    async find(filter) {
        const cursor = await this.Order.find(filter).sort({ "date_created": -1 });
        return await cursor.toArray();
    }

    async findByName(name) {
        const cursor = await this.Order.find({
            'receiver.name': { $regex: new RegExp(name), $options: "i" },
        }).sort({ "date_created": -1 });
        return await cursor.toArray();
    }

    async findByUserID(UserID) {
        const cursor = await this.Order.find({
            _userid: UserID ? UserID.toString() : null
        }).sort({ "date_created": -1 });
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Order.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async create(payload) {
        const order = this.extractOrderData({
            ...payload,
            created_date: new Date().toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
            }),
            delivery: false
        });

        const result = await this.Order.insertOne(order);
        return result.value;
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        }
        const update = this.extractOrderData(payload);
        const result = await this.Order.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Order.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }
}

module.exports = OrderService;