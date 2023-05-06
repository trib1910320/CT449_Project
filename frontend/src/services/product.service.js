import createApiClient from "./api.service";
import { useAuthStore } from '@/stores/store';

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

    async productOne(id) {
        const res = await this.api.get(`/${id}`)
        return res.data;
    }

    async createProduct(data) {
        const authStore = useAuthStore();
        const res = await this.api.post('/', data,  {
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                "Content-Type": "multipart/form-data",
                Accept: "multipart/form-data",
            }
        })
        return res.data;
    }

    async updateProduct(data) {
        const authStore = useAuthStore();
        const res = await this.api.put(`/${data._id}`, data,  {
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                "Content-Type": "multipart/form-data",
                Accept: "multipart/form-data",
            }
        })
        return res.data;
    }

    async deleteProduct(id) {
        const authStore = useAuthStore();
        const res = await this.api.delete(`/${id}`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        return res.data;
    }
}

export default new ProductService();