import createApiClient from "./api.service";

class ProductService {
    constructor(baseUrl = "/api/products") {
        this.api = createApiClient(baseUrl);
        // console.log(this.api);
    }

    async productAll() {
        const res = await this.api.get("/")
        return res.data;
    }

    async productNew() {
        const res = await this.api.get("/new")
        return res.data;
    }

    async productByType(typeid) {
        const res = await this.api.get("/", { params: { typeid: typeid } })
        return res.data;
    }

    async productByName(name) {
        const res = await this.api.get("/", { params: { name: name } });
        return res.data;
    }

    async productOne(id) {
        const res = await this.api.get(`/${id}`)
        return res.data;
    }
}

export default new ProductService();