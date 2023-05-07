<template>
    <div class="modal-header">
        <div class="modal-title row" :id="modalLabels">
            <span class="fs-4 fw-bold">Order details</span>
            <p class="col-6">Code orders: {{ order._id }}</p>
            <p class="col-6">Booking date: {{ order.date_created }}</p>
        </div>
        <button class="btn border-0 text-danger" type="reset" data-bs-dismiss="modal" aria-label="Close">
            <i class="fa-sharp fa-solid fa-circle-xmark" style="font-size: 1.5rem;"></i>
        </button>
    </div>
    <div class="modal-body">
        <div class="card table-responsive">
            <table class="table table-borderless">
                <thead>
                    <tr class="table-primary">
                        <th>Image</th>
                        <th>Product's name</th>
                        <th>Size</th>
                        <th>Quantity</th>
                        <th>Toppings</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(orderItem) in order.order_items" :key="orderItem">
                        <OrderItem :id="orderItem" />
                    </tr>
                </tbody>
            </table>
        </div>
        <br>
        <span class="fs-4 fw-bold">Total amount: </span>
        <span class="fs-5">
            {{ (order.total_amount).toLocaleString('it-IT', {
                style:
                    'currency', currency: 'VND'
            }) }}
        </span>
        <br>
        <span class="fs-6 fw-bold">Status: </span>
        <span v-if="order.status == 0" class="text-secondary">Đợi xử lý</span>
        <span v-else-if="order.status == 1" class="text-primary">Đang giao</span>
        <span v-else class="text-success">Hoàn thành</span>
        <br>
        <span class="fs-6 fw-bold">Note: </span>
        <span>{{ order.note }}</span>
    </div>
    <div class="modal-footer justify-content-center">
        <div v-if="this.authStore.admin == true">
            <button v-if="order.status == 0" class="btn btn-primary" @click="updateOrder(1)">
                <i class="fa-solid fa-trash"></i> Đã xử lý
            </button>
            <button v-if="order.status == 1" class="btn btn-success" @click="updateOrder(2)">
                <i class="fa-solid fa-trash"></i> Đã hoàn thành
            </button>
        </div>
        <button v-if="order.status == 0" class="btn btn-danger" @click="deleteOrder">
            <i class="fa-solid fa-trash"></i> Hủy đơn hàng
        </button>
    </div>
</template>
<script>
import OrderItem from "@/components/order/OrderItem.vue";

import { useAuthStore } from '@/stores/store';
export default {
    components: {
        OrderItem
    },
    emits: ["delete:order", "update:order"],
    data() {
        return {
            authStore: useAuthStore(),
        }
    },
    props: {
        order: { type: Object, required: true },
        modalLabels: { type: String, default: null }
    },
    methods: {
        deleteOrder() {
            this.$emit("delete:order", this.order._id);
        },
        updateOrder(val) {
            const data = {
                id: this.order._id,
                status: val
            }
            this.$emit("update:order", data);
        },
    },
}
</script>

<style scoped>
button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
}
</style>