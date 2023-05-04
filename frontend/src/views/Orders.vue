<template >
    <div class="text-center fs-3 text-black fw-bold">
        <i class="fa-solid fa-clipboard-list mx-2" style="color: orange;"></i>
        <span>Danh sách đơn hàng</span>
    </div>
    <div class="card">
        <table class="table table-borderless">
            <thead>
                <tr class="table-primary">
                    <th>Mã đơn hàng</th>
                    <th>Tên người nhận</th>
                    <th>Số điện thoại</th>
                    <th>Địa chỉ</th>
                    <th>Thanh toán</th>
                    <th>Tổng tiền</th>
                    <th>Ngày đặt</th>
                    <th>Trạng thái:</th>
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
                        <button v-if="order.status == 0" class="btn btn-outline-danger" @click="deleteOrder(order._id)">
                            Hủy
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import OrderService from "@/services/order.service";
import OrderItemService from "@/services/orderitem.service";

import { useCartStore, } from '@/stores/store';
export default {
    components: {

    },
    data() {
        return {
            cartStore: useCartStore(),
            orders: []
        }
    },
    methods: {
        async getOrders() {
            this.orders = await OrderService.getAll();
        },
        async deleteOrder(id){
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