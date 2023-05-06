import createApiClient from "./api.service";
import { useAuthStore } from '@/stores/store';

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

    async createTopping(data) {
        const authStore = useAuthStore();
        const res = await this.api.post('/', data, {
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            }
        })
        return res.data;
    }

    async updateTopping(data) {
        const authStore = useAuthStore();
        const res = await this.api.put(`/${data._id}`, data, {
            headers: {
                Authorization: `Bearer ${authStore.token}`,
            }
        })
        return res.data;
    }

    async deleteTopping(id) {
        const authStore = useAuthStore();
        const res = await this.api.delete(`/${id}`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        return res.data;
    }
}

export default new ToppingService();