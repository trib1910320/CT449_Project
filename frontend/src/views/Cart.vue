<template >
    <div class="text-center fs-3 text-black fw-bold">
        <i class="fa-solid fa-clipboard-check mx-2" style="color: orange;"></i>
        <span>Xác nhận đơn hàng</span>
    </div>
    <Form @submit="submitOrder" :validation-schema="orderFormSchema">
        <div class="row">
            <div class="col-lg-5">
                <div class="card">
                    <!-- Delivery -->
                    <h6 class="title">Delivery</h6>
                    <div class="form-group my-1">
                        <Field name="name" type="text" class="form-control" v-model="orderLocal.name"
                            placeholder="The recipient's name" />
                        <ErrorMessage name="name" class="error-feedback" />
                    </div>
                    <div class="form-group my-1">
                        <Field name="phone" type="text" class="form-control" v-model="orderLocal.phone"
                            placeholder="Phone number starts ( 09|03|07|08|05 )." />
                        <ErrorMessage name="phone" class="error-feedback" />
                    </div>
                    <div class="form-group my-1">
                        <Field name="address" type="text" class="form-control" v-model="orderLocal.address"
                            placeholder="The recipient's address." />
                        <ErrorMessage name="address" class="error-feedback" />
                    </div>
                    <div class="form-group my-1">
                        <Field v-slot="{ field }" v-model="orderLocal.note" name="note">
                            <textarea v-bind="field" name="note" rows="2" class="form-control"
                                placeholder="Enter note here" />
                        </Field>
                    </div>
                    <!-- Payment methods -->
                    <h6 class="title">Payment methods</h6>
                    <div class="form-check">
                        <Field class="form-check-input" type="radio" name="payment" value="Cash"
                            v-model="orderLocal.payment" />
                        <label class="form-check-label my-auto mx-2" for="payment1">
                            <img class="payment-method"
                                src="https://minio.thecoffeehouse.com/image/tchmobileapp/1000_photo_2021-04-06_11-17-08.jpg"
                                alt="">
                            <span class="mx-2">Cash</span>
                        </label>
                    </div>
                    <div class="form-check">
                        <Field class="form-check-input" type="radio" name="payment" value="MoMo"
                            v-model="orderLocal.payment" />
                        <label class="form-check-label my-auto mx-2" for="payment2">
                            <img class="payment-method"
                                src="https://minio.thecoffeehouse.com/image/tchmobileapp/386_ic_momo@3x.png" alt="">
                            <span class="mx-2">MoMo</span>
                        </label>
                    </div>
                    <div class="form-check">
                        <Field class="form-check-input" type="radio" name="payment" value="Bank Card"
                            v-model="orderLocal.payment" />
                        <label class="form-check-label my-auto mx-2" for="payment3">
                            <img class="payment-method"
                                src="https://minio.thecoffeehouse.com/image/tchmobileapp/385_ic_atm@3x.png" alt="">
                            <span class="mx-2">Bank Card</span>
                        </label>
                    </div>
                    <ErrorMessage name="payment" class="error-feedback" />
                </div>
            </div>
            <div class="col-lg-7">
                <div class="card">
                    <h6 class="title">Shopping cart item list</h6>
                    <!-- List -->
                    <div v-if="this.cart.length != 0">
                        <div v-for="(cartItem, index) in this.cart" :key="index + cartItem._productid">
                            <CartItem :cartItem="cartItem" :index="index" v-model="totalMoney" />
                        </div>
                    </div>
                    <div v-else class="my-3 text-center">
                        <router-link class="btn btn-primary p-2 fs-5 fw-bolder" :to="{ name: 'products' }">
                            Add product
                        </router-link>
                    </div>
                    <!-- Total -->
                    <h6 class="title">Total</h6>
                    <div class="d-flex align-items-center justify-content-between">
                        <div class=" d-flex">
                            <h5 class="mb-0 fw-bold">Thành tiền:</h5>
                        </div>
                        <h5 class=" mb-0">
                            {{ this.totalMoney.toLocaleString('it-IT', {
                                style:
                                    'currency', currency: 'VND'
                            }) }}
                        </h5>
                    </div>
                    <button type="submit" class="btn btn-warning px-4 py-2 mt-4 fw-bold">
                        Order
                    </button>
                </div>
            </div>
        </div>
    </Form>
</template>
<script>
import CartItem from "@/components/CartItem.vue";

import OrderService from "@/services/order.service";
import OrderItemService from "@/services/orderitem.service";

import { useCartStore, } from '@/stores/store';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    components: {
        Form, Field, ErrorMessage, CartItem
    },
    data() {
        const orderFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Please enter the recipient's name.")
                .min(4, "Must have at least 4 characters.")
                .max(20, "First name has at most 20 characters."),
            phone: yup
                .string()
                .required("Please enter the recipient's phone number.")
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Invalid phone number."),
            address: yup
                .string()
                .required("Please enter the recipient's address.")
                .min(8, "Must have at least 8 characters.")
                .max(50, "Account has at most 50 characters."),
            note: yup
                .string()
                .max(100, "Account has at most 50 characters."),
            payment: yup
                .string()
                .required("Please choose payment method."),

        });
        return {
            cartStore: useCartStore(),
            orderFormSchema,
            orderLocal: { payment: "Cash" },
            cart: [],
            totalMoney: 0
        }
    },
    methods: {
        getCart() {
            this.cart = this.cartStore.cart;
        },
        async submitOrder() {
            let orderItem = [];
            for (const cartitem of this.cart) {
                const orderI = await OrderItemService.createOrderItem(cartitem);
                orderItem.push(orderI._id);
            }
            await OrderService.createOrder(this.orderLocal, orderItem);
            this.cartStore.resetCart();
            this.$router.push({ name: 'orders'});
        },
    },
    created() {
        this.getCart();
    }
}
</script>
<style scoped>
@import "@/assets/form.css";

img.payment-method {
    width: 40px;
}

.card {
    background-color: white;
    border-radius: 10px;
}

.form-check-input[type=radio] {
    padding: 10px;
}

.title {
    color: orange;
    font-size: 24px;
    font-weight: bold;
}

button.btn-warning:hover {
    background-color: orange;
    color: white;
}
</style>