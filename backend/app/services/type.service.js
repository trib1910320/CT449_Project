const { ObjectId } = require("mongodb");

class TypeService {
    constructor(client) {
        this.Type = client.db().collection("types");
    }
    extractTypeData(payload) {
        const type = {
            common: payload.common,
            name: payload.name,
            created_date: payload.created_date,
        };
        Object.keys(type).forEach(
            (key) => type[key] === undefined && delete type[key]
        );

        return type;
    }

    async find(filter) {
        const cursor = await this.Type.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        const cursor = await this.Type.find({
            name: { $regex: new RegExp(name), $options: "i" },
        });
        return await cursor.toArray();
    }

    async findByCommon(common) {
        const cursor = await this.Type.find({
            common: { $regex: new RegExp(common), $options: "i" },
        });
        return await cursor.toArray();
    }

    async findById(id) {
        return await this.Type.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    async create(payload) {
        const type = this.extractTypeData(payload);

        const result = await this.Type.findOneAndUpdate(
            type,
            {
                $set: {
                    created_date: new Date().toLocaleString("vi-VN", {
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
        const update = this.extractTypeData(payload);
        const result = await this.Type.findOneAndUpdate(
            filter,
            { $set: {
                ...update,
                created_date: new Date().toLocaleString("vi-VN", {
                    timeZone: "Asia/Ho_Chi_Minh",
                }),
            } },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.Type.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
        return result.value;
    }
}

module.exports = TypeService;