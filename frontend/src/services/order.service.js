import createApiClient from "./apiJWT.service";
import { useAuthStore } from '@/stores/store';

class OrderService {
    constructor(baseUrl = "/api/orders") {
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

    async createOrder(data, orderItem) {
        const authStore = useAuthStore();
        const payload= {
            ...data,
            receiver: {
                name: data.name,
                phone: data.phone,
                address: data.address,
            },
            order_items: orderItem
        }
        const res = await this.api.post('/', payload, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        return res.data;
    }

    async updateOrder(id, data) {
        const authStore = useAuthStore();
        const res = await this.api.put(`/${id}`, data, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        return res.data;
    }

    async deleteOrder(id) {
        const authStore = useAuthStore();
        const res = await this.api.delete(`/${id}`, {
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        return res.data;
    }
    
}

export default new OrderService();