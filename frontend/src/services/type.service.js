import createApiClient from "./api.service";
import { useAuthStore } from '@/stores/store';

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

    async createType(data) {
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

    async updateType(data) {
        const authStore = useAuthStore();
        const res = await this.api.put(`/${data._id}`, data, {
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                "Content-Type": "multipart/form-data",
                Accept: "multipart/form-data",
            }
        })
        return res.data;
    }

    async deleteType(id) {
        const authStore = useAuthStore();
        const res = await this.api.delete(`/${id}`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        return res.data;
    }
}

export default new TypeService();