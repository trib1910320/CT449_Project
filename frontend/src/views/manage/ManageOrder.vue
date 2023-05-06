<template>
    <div v-if="this.authStore.admin" class="card">
        <div class="row my-3">
            <div class="col-5">
                <InputSearch class="mx-5" v-model="searchText" />
            </div>
            <div class="col-7">
               
            </div>
        </div>
        <div class="card table-responsive">
            <table class="table table-borderless">
                <thead>
                    <tr class="table-primary">
                        <th></th>
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
                    <tr v-for="(order, index) in filteredOrders" :key="order._id">
                        <td>{{ index + 1 }}</td>
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
                            <button class="btn btn-outline-primary m-1 mx-auto" data-bs-toggle="modal"
                                :data-bs-target="'#orderDetailModal' + order._id">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button v-if="order.status == 0" class="btn btn-outline-danger mx-auto" @click="deleteOrder(order._id)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                        <!-- Modal Order-->
                        <div class="modal fade" :id="'orderDetailModal' + order._id" tabindex="-1"
                            aria-labelledby="orderDetailModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered modal-lg">
                                <div class="modal-content">
                                    <OrderDetail :order="order" @delete:order="deleteOrder" @update:order="updateOrder"
                                        modalLabels="orderDetailModalLabel" />
                                </div>
                            </div>
                        </div>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import OrderService from "@/services/order.service";

import OrderDetail from "@/components/order/OrderDetail.vue";
import inputSearch from "@/mixins/inputSearch";
import { useAuthStore } from '@/stores/store';
export default {
    components: {
        OrderDetail
    },
    data() {
        return {
            authStore: useAuthStore(),
            orders: []
        };
    },
    mixins:[inputSearch],
    computed: {

        filteredOrders() {
            if (!this.searchText) return this.orders;
            return this.orders.filter((order) =>
                this.removeAccents(order.receiver.name).toLowerCase()
                    .includes(this.removeAccents(this.searchText).toLowerCase())
            );
        },
    },
    methods: {
        async getOrderAll() {
            this.orders = await OrderService.getAll();
        },
        async deleteOrder(id) {
            await OrderService.deleteOrder(id);
            this.$router.go();
        },
        async updateOrder(data){
            await OrderService.updateOrder(data);
            this.$router.go();
        }
    },
    created() {
        this.getOrderAll();
    },
}
</script>
<style scoped></style>