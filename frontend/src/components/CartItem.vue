<template>
    <div class=" d-flex align-items-center justify-content-between my-2">
        <div class="d-flex">
            <h6 class="fw-bold my-auto">{{ this.product.name }}</h6>
            <span class="mx-2">
                | {{ this.cartItem.quantity }} x {{ this.cartItem.size }}
            </span>
            <span class=""> |
                {{ ((countPrice + this.product.price) *
                    this.cartItem.quantity).toLocaleString('it-IT', {
                        style:
                            'currency', currency: 'VND'
                    }) }}
            </span>
        </div>
        <div class="d-flex">
            <button type="button" class="btn btn-outline-warning mx-1" data-bs-toggle="modal"
                :data-bs-target="'#cartItemFormModal' + this.product._id">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button type="button" class="btn btn-outline-danger mx-1" @click="deleteCartItem">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </div>
    <!-- Modal CartItemForm-->
    <div class="modal fade" :id="'cartItemFormModal' + this.product._id" tabindex="-1"
        aria-labelledby="cartItemFormModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <CartItemForm :product="this.product" @submit:cartItem="updateCartItem" :cartItem="this.cartItem"
                    modalLabels="cartItemFormModalLabel" />
            </div>
        </div>
    </div>
</template>
<script>
import ProductService from "@/services/product.service";

import CartItemForm from "@/components/product/CartItemForm.vue";
import { useCartStore } from '@/stores/store';
export default {
    components: {
        CartItemForm
    },
    props: {
        cartItem: { type: Object, require: true },
        index: { type: Number, require: true },
        modelValue: { type: Number, default: 0 },
    },
    data() {
        return {
            cartStore: useCartStore(),
            product: {},
            amount: 0
        };
    },
    computed: {
        countPrice() {
            let price = 0;
            if (this.cartItem.size == 'Medium') price += 4000;
            else if (this.cartItem.size == 'Big') price += 10000;
            if (this.cartItem.topping.length > 0) {
                price = price + (this.cartItem.topping.length * 10000);
            }
            return price;
        },
    },
    emits: ["update:modelValue"],
    methods: {
        countTotal() {
            let totalMoney = this.modelValue;
            let price = 0;
            if (this.cartItem.size == 'Medium') price += 4000;
            else if (this.cartItem.size == 'Big') price += 10000;
            if (this.cartItem.topping.length > 0) {
                price = price + (this.cartItem.topping.length * 10000);
            }
            totalMoney = totalMoney + ((price + this.product.price) * this.cartItem.quantity);
            this.$emit("update:modelValue", totalMoney);
        },
        async getProduct() {
            this.product = await ProductService.productOne(this.cartItem._productid);
            this.countTotal();
        },
        async updateCartItem(data) {
            this.cartStore.updateCart(this.index, data);
            alert("Đã cập nhật " + this.product.name + " trong giỏ hàng");
            this.$router.go();
        },
        deleteCartItem() {
            this.cartStore.deleteCart(this.index);
        }
    },
    created() {
        this.getProduct();
    }
}
</script>
<style scoped></style>