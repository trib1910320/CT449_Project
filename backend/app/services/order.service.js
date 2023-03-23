const { ObjectId } = require("mongodb");

class OrderService {
    constructor(client) {
        this.Order = client.db().collection("orders");
    }
    extractOrderData(payload) {
        const order = {
            _uid: payload._uid,
            status: payload.status,
            processor: payload.processor,
            amount: payload.amount,
            customer: {
                name: payload.name,
                phone: payload.phone,
                address: payload.address,
                note: payload.note
            },
            order_items: payload.order_items,
            date_created: payload.date_created,
        };
        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        );

        Object.keys(order.customer).forEach(
            (key) => order.customer[key] === undefined && delete order.customer[key]
        );
        if (Object.keys(order.customer).length == 0) { delete order.customer };
        
        order.amount = parseInt(order.amount);

        return order;
    }

    async find(filter) {
        const cursor = await this.Order.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.Order.find({
            'customer.name': { $regex: new RegExp(name), $options: "i" },
        });
    }

    async findById(id) {
        return await this.Order.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async create(payload) {
        const order = this.extractOrderData(payload);

        const result = await this.Order.findOneAndUpdate(
            order,
            {
                $set: {
                    date_created: new Date().toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                    }),
                    status: 0
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