<template>
    <div class="card m-1">
        <router-link :to="{ name: 'products.detail', params: { id: this.product._id } }">
            <div class="card-header d-flex justify-content-between">
                <img :src="this.product.image?.img_data" class="" alt="Product Image">
            </div>
            <div class="card-body">
                <h5 class="fw-bold">{{ this.product.name }}</h5>
            </div>
        </router-link>
        <div class="card-footer">
            <div class="row">
                <h6 class="col-8">
                    {{ (this.product.price).toLocaleString('it-IT', {
                        style:
                            'currency', currency: 'VND'
                    }) }}
                </h6>
                <div class="col-4">
                    <button class="btn btn-warning float-end add-cart" data-bs-toggle="modal"
                        :data-bs-target="'#cartItemFormModal' + this.product._id">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>

    </div>
    <!-- Modal CartItemForm-->
    <div class="modal fade" :id="'cartItemFormModal' + this.product._id" tabindex="-1"
        aria-labelledby="cartItemFormModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <CartItemForm :product="this.product" @submit:cartItem="addCartItem" :cartItem="cartItem"
                    modalLabels="cartItemFormModalLabel" />
            </div>
        </div>
    </div>
</template>
<script>
import CartItemForm from "@/components/product/CartItemForm.vue";

import { useCartStore } from '@/stores/store';
export default {
    components: {
        CartItemForm
    },
    data() {
        return {
            cartStore: useCartStore(),
            cartItem: {}
        }
    },
    props: {
        product: { type: Object, required: true }
    },
    methods: {
        async addCartItem(data) {
            const cart = this.cartStore.cart;
            const objIndex = cart.findIndex((obj => obj._productid == data._productid && obj.size == data.size));
            if (objIndex != -1) {
                this.cartStore.updateCart(objIndex, data);
                alert("Đã cập nhật " + this.product.name + " trong giỏ hàng");
            }
            else {
                this.cartStore.addCart([...this.cartStore.cart, data]);
                alert("Đã thêm " + this.product.name + " vào giỏ hàng");
            }
        }
    }
}
</script>
<style scoped>
img {
    width: 100%;
    border-radius: 10px;
}

.add-cart {
    z-index: 1;
}

.card {
    width: 240px;
    border: 0;
}

.card:hover {
    background-color: white;
    border: 0;
}

.card:hover {
    border: 0.5px solid rgb(200, 200, 200);
    width: 245px;
}

.card-header,
.card-body,
.card-footer {
    background-color: white;
    border: 0;
}
</style>
