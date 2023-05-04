<template>
    <Form @submit="submitCartItem" :validation-schema="cartItemFormSchema">
        <div class="modal-header">
            <h5 v-if="this.cartItem._productid" class="modal-title" :id="modalLabels">Update cart item</h5>
            <h5 v-else class="modal-title" :id="modalLabels">Add product to cart</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <!-- ProductDetail vs Quantity -->
            <div class="row">
                <div class="col-lg-4">
                    <img :src="this.product.image?.img_data" alt="Product Image">
                </div>
                <div class="col-lg-8">
                    <h5>{{ this.product.name }}</h5>
                    <span>{{ this.product.describe }}</span>
                    <div class="row mt-3">
                        <span class="fw-bolder">Price: {{ ((this.product.price + countPrice) *
                            countQuantity).toLocaleString('it-IT', {
                                style:
                                    'currency', currency: 'VND'
                            }) }}</span>
                        <div>
                            <button type="button" class="btn btn-warning" :disabled="(countQuantity == 1)"
                                @click="decreaseQuantity()">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                            <span class="mx-4 fs-5 fw-bolder">
                                {{ countQuantity }}
                            </span>
                            <button type="button" class="btn btn-warning" @click="increaseQuantity()">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                        </div>
                    </div>
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
                        <Field class="form-check-input" type="radio" name="size" value="Big" v-model="cartItemLocal.size" />
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
        </div>
        <div class="modal-footer">
            <div class="form-group mx-auto">
                <button type="submit" data-bs-dismiss="modal" class="btn btn-warning px-4 py-2 fw-bold">
                    {{ ((this.product.price + countPrice) *
                        countQuantity).toLocaleString('it-IT', {
                            style:
                                'currency', currency: 'VND'
                        }) }}
                    <span v-if="this.cartItem._productid">
                        - Update
                    </span>
                    <span v-else>
                        - Add to cart
                    </span>
                </button>
            </div>
        </div>

    </Form>
</template>
<script>
import ToppingService from "@/services/topping.service";

import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
    components: {
        Form, Field, ErrorMessage,
    },
    props: {
        product: { type: Object, required: true },
        cartItem: { type: Object, required: true },
        modalLabels: { type: String, default: null }
    },
    data() {
        const cartItemFormSchema = yup.object().shape({
            size: yup
                .string()
                .required("Please choose your size."),
        });
        return {
            cartItemFormSchema,
            cartItemLocal: { size: 'Small', ...this.cartItem },
            quantity: this.cartItem.quantity ? this.cartItem.quantity : 1,
            toppingsChecked: this.cartItem.topping ? this.cartItem.topping : [],
            toppings: []
        }
    },
    computed: {
        countQuantity() {
            return this.quantity;
        },
        countPrice() {
            let price = 0;
            if (this.cartItemLocal.size == 'Medium') price += 4000;
            else if (this.cartItemLocal.size == 'Big') price += 10000;
            if (this.toppingsChecked.length > 0) {
                price = price + (this.toppingsChecked.length * 10000);
            }
            return price;
        },
    },
    methods: {
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
            this.$emit("submit:cartItem", this.cartItemLocal);
        },
    },
    created() {
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

img {
    height: 140px;
    width: 140px;
    border-radius: 10%;
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
</style>