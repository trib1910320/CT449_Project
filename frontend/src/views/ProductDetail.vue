<template>
    <Form @submit="submitCartItem" :validation-schema="cartItemFormSchema" class="card">
        <div class="row m-4">
            <div class="col-lg-5">
                <!-- ProductDetail-->
                <img class="m-2" :src="this.product.image?.img_data" alt="Product Image">
                <p>{{ this.product.describe }}</p>
            </div>
            <div class="col-lg-7">
                <h4 class="mb-2">{{ this.product.name }}</h4>
                <!-- Quantity  -->
                <div class="row my-4">
                    <span class="fs-5 col-6 my-auto">
                        Price: {{ ((this.product.price + checkSize) *
                            countQuantity).toLocaleString('it-IT', {
                                style:
                                    'currency', currency: 'VND'
                            }) }}
                    </span>
                    <div class="col-6">
                        <button type="button" class="btn btn-warning" :disabled="(countQuantity == 1)"
                            @click="decreaseQuantity()">
                            <i class="fa-solid fa-minus"></i>
                        </button>
                        <span class="mx-4 fs-5 fw-bolder">
                            {{ countQuantity }}
                        </span>
                        <button type="button" class="btn btn-warning" :disabled="(countQuantity == 99)"
                            @click="increaseQuantity()">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
                <!-- Size -->
                <div class="card mt-4">
                    <h5>SELECT SIZE (REQUIRED)</h5>
                    <div class="d-flex justify-content-evenly">
                        <div class="form-check mx-1">
                            <Field class="form-check-input" type="radio" name="size" value="Small"
                                v-model="cartItemLocal.size" />
                            <label class="form-check-label" for="size1">
                                <p>Small +0VND</p>
                            </label>
                        </div>
                        <div class="form-check mx-1">
                            <Field class="form-check-input" type="radio" name="size" value="Medium"
                                v-model="cartItemLocal.size" />
                            <label class="form-check-label" for="size2">
                                <p>Medium +4.000VND</p>
                            </label>
                        </div>
                        <div class="form-check mx-1">
                            <Field class="form-check-input" type="radio" name="size" value="Big"
                                v-model="cartItemLocal.size" />
                            <label class="form-check-label" for="size3">
                                <p>Big +10.000VND</p>
                            </label>
                        </div>
                        <ErrorMessage name="size" class="error-feedback" />
                    </div>
                </div>
                <!-- Topping -->
                <div class="card mt-2">
                    <h5>SELECT TOPPING (OPTIONAL)</h5>
                    <ul>
                        <li class="d-flex justify-content-between align-items-center" v-for="(topping) in this.toppings"
                            :key="topping._id">
                            <div>
                                <h6>{{ topping.name }}</h6>
                                <p>+{{ (topping.price).toLocaleString('it-IT', {
                                    style: 'currency', currency: 'VND'
                                }) }}
                                </p>
                            </div>
                            <input class="form-check-input" name="topping" type="checkbox" :value="topping._id"
                                :id="topping._id" v-model="toppingsChecked">
                        </li>
                    </ul>
                </div>
                <div class="form-group mx-auto">
                    <button type="submit" class="btn btn-warning px-4 py-2 fw-bold">
                        {{ ((this.product.price + checkSize) *
                            countQuantity).toLocaleString('it-IT', {
                                style:
                                    'currency', currency: 'VND'
                            }) }}
                        - Add to cart
                    </button>
                </div>
            </div>
        </div>
    </Form>
</template>
<script>
import ProductService from "@/services/product.service";
import ToppingService from "@/services/topping.service";

import { useCartStore } from '@/stores/store';
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    components: {
        Form, Field, ErrorMessage,
    },
    props: {
        id: { type: String, require: true }
    },
    data() {
        const cartItemFormSchema = yup.object().shape({
            size: yup
                .string()
                .required("Please choose your size."),
        });
        return {
            cartStore: useCartStore(),
            cartItemFormSchema,
            cartItemLocal: { size: 'Small', ...this.cartItem },
            quantity: 1,
            toppingsChecked: [],
            toppings: [],
            product: {}
        }
    },
    computed: {
        countQuantity() {
            return this.quantity;
        },
        checkSize() {
            let amount = 0;
            if (this.cartItemLocal.size == 'Medium') amount += 4000;
            else if (this.cartItemLocal.size == 'Big') amount += 10000;
            if (this.toppingsChecked.length > 0) {
                amount = amount + (this.toppingsChecked.length * 10000);
            }
            return amount;
        },
        
    },
    methods: {
        async getProduct() {
            this.product = await ProductService.productOne(this.id);
        },
        async getToppings() {
            this.toppings = await ToppingService.toppingAll();
        },
        increaseQuantity() {
            if (this.quantity < 99)
                this.quantity++;
        },
        decreaseQuantity() {
            if (this.quantity > 1)
                this.quantity--;
        },
        submitCartItem() {
            this.cartItemLocal._productid = this.product._id
            this.cartItemLocal.topping = this.toppingsChecked;
            this.cartItemLocal.quantity = this.quantity;
            const cart = this.cartStore.cart;
            const objIndex = cart.findIndex((obj => obj._productid == this.cartItemLocal._productid && obj.size == this.cartItemLocal.size));
            if (objIndex != -1) {
                alert("Đã cập nhật " + this.product.name + " trong giỏ hàng");
                this.cartStore.updateCart(objIndex, this.cartItemLocal);
            }
            else {
                this.cartStore.addCart([...this.cartStore.cart, this.cartItemLocal]);
                alert("Đã thêm " + this.product.name + " vào giỏ hàng");
            }
        },
    },
    created() {
        this.getProduct();
        this.getToppings();
    }
}
</script>

<style scoped>
@import "@/assets/form.css";

.card {
    background-color: white;
    border-radius: 10px;
}

.form-check-input[type=radio] {
    padding: 8px;
}

.form-check-input[type=checkbox] {
    padding: 12px;
}

.form-check-input[type=checkbox]:checked,
.form-check-input[type=radio]:checked {
    background-color: orange;
    border-color: orangered;
}

button.btn-warning:hover {
    background-color: orange;
    color: white;
}

.error-feedback {
    position: absolute;
    bottom: -15px;
    font-size: 20px;
}

img {
    width: 90%;
    border-radius: 10%;
}
</style>