import createApiClient from "./api.service";

class TypeService {
    constructor(baseUrl = "/api/types") {
        this.api = createApiClient(baseUrl);
        // console.log(this.api);
    }

    async typeAll() {
        const res = await this.api.get("/")
        return res.data;
    }

    async typeOne(id) {
        const res = await this.api.get(`/${id}`)
        return res.data;
    }
}

export default new TypeService();