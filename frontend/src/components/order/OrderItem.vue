<template>
    <td><img :src="this.orderItem[0]?.product.image.img_data" alt=""></td>
    <td>{{ this.orderItem[0]?.product.name }}</td>
    <td>{{ this.orderItem[0]?.size }}</td>
    <td>{{ this.orderItem[0]?.quantity }}</td>
    <td>{{ this.toppings.toString() }}</td>
    <td>
        {{ (this.orderItem[0]?.total_amount)?.toLocaleString('it-IT', {
            style:
                'currency', currency: 'VND'
        }) }}
    </td>
</template>
<script>
import OrderItemService from "@/services/orderitem.service";
import ToppingService from "@/services/topping.service";

export default {
    props: {
        id: { type: String, required: true }
    },
    data() {
        return {
            orderItem: {},
            toppings: []
        }
    },
    methods: {
        async getOrderItem() {
            this.orderItem = await OrderItemService.getOne(this.id);
            for (const toppingId of this.orderItem[0]?.topping) {
                this.getTopping(toppingId);
            }
        },
        async getTopping(id) {
            const topping = await ToppingService.toppingOne(id);
            this.toppings = [...this.toppings, topping.name]
        },
    },
    created() {
        this.getOrderItem();
    }
}
</script>

<style scoped>
img {
    width: 60px;
    height: 60px;
    border-radius: 5px;
}
</style>