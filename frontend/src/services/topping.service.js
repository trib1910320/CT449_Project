import createApiClient from "./api.service";

class ToppingService {
    constructor(baseUrl = "/api/toppings") {
        this.api = createApiClient(baseUrl);
        // console.log(this.api);
    }

    async toppingAll() {
        const res = await this.api.get("/")
        return res.data;
    }

    async toppingOne(id) {
        const res = await this.api.get(`/${id}`)
        return res.data;
    }

}

export default new ToppingService();