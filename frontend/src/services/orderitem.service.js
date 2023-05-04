import createApiClient from "./apiJWT.service";
import { useAuthStore } from '@/stores/store';

class OrderItemService {
    constructor(baseUrl = "/api/orderitems") {
        this.api = createApiClient(baseUrl);
        // console.log(this.api);
    }

    async getOne(id) {
        const authStore = useAuthStore();
        const res =await this.api.get((`/${id}`),{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });
        return res.data;
    }

    async getAll() {
        const authStore = useAuthStore();
        const res =await this.api.get(('/'),{
            headers:{Authorization:`Bearer ${authStore.token}`}
        });
        return res.data;
    }

    async createOrderItem(data) {
        const authStore = useAuthStore();
        const res = await this.api.post('/', data, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        return res.data;
    }

    async updateOrderItem(id, data) {
        const authStore = useAuthStore();
        const res = await this.api.put(`/${id}`, data, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        return res.data;
    }
    
    
}

export default new OrderItemService();