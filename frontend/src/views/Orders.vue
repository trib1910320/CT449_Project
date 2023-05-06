<template >
    <div class="text-center fs-3 text-black fw-bold">
        <i class="fa-solid fa-clipboard-list mx-2" style="color: orange;"></i>
        <span>Order List</span>
    </div>
    <div class="card table-responsive">
        <table class="table table-borderless">
            <thead>
                <tr class="table-primary">
                    <th>Code orders</th>
                    <th>Recipient's name</th>
                    <th>Phone number</th>
                    <th>Address</th>
                    <th>Payment methods</th>
                    <th>Total amount</th>
                    <th>Booking date</th>
                    <th>Status</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order) in orders" :key="order._id">
                    <td>{{ order._id }}</td>
                    <td>{{ order.receiver.name }}</td>
                    <td>{{ order.receiver.phone }}</td>
                    <td>{{ order.receiver.address }}</td>
                    <td>{{ order.payment }}</td>
                    <td>
                        {{ order.total_amount.toLocaleString('it-IT', {
                            style:
                                'currency', currency: 'VND'
                        }) }}
                    </td>
                    <td>{{ order.date_created }}</td>
                    <td>
                        <span v-if="order.status == 0" class="text-secondary">Đợi xử lý</span>
                        <span v-else-if="order.status == 1" class="text-primary">Đang giao</span>
                        <span v-else class="text-success">Hoàn thành</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary mx-1" data-bs-toggle="modal" :data-bs-target="'#orderDetailModal' + order._id">
                            <i class="fa-solid fa-eye"></i>
                        </button>
                        <button v-if="order.status == 0" class="btn btn-outline-danger" @click="deleteOrder(order._id)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                    <!-- Modal OrderDetail-->
                    <div class="modal fade" :id="'orderDetailModal' + order._id" tabindex="-1" aria-labelledby="orderDetailModalLabel"
                        aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content">
                                <OrderDetail :order="order" @delete:order="deleteOrder" modalLabels="orderDetailModalLabel" />
                            </div>
                        </div>
                    </div>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import OrderService from "@/services/order.service";
import OrderDetail from "@/components/order/OrderDetail.vue";

import { useCartStore, } from '@/stores/store';
export default {
    components: {
        OrderDetail
    },
    data() {
        return {
            cartStore: useCartStore(),
            orders: []
        }
    },
    methods: {
        async getOrders() {
            this.orders = await OrderService.getUser();
        },
        async deleteOrder(id) {
            await OrderService.deleteOrder(id);
            this.$router.go();
        }
    },
    created() {
        this.getOrders();
    }
}
</script>
<style scoped></style>