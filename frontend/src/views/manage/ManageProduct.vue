<template>
    <div v-if="this.authStore.admin" class="card">
        <div class="row my-3">
            <div class="col-5">
                <InputSearch class="mx-5" v-model="searchText" />
            </div>
            <div class="col-7 text-end">
                <button class="btn btn-primary mx-5" data-bs-toggle="modal" data-bs-target="#productCreateModal">
                    <i class="fa-solid fa-folder-plus"></i> Add product
                </button>
            </div>
            <!-- Modal Product Create-->
            <div class="modal fade" id="productCreateModal" tabindex="-1" aria-labelledby="productCreateModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <ProductForm :product="{}" @submit:product="createProduct" modalLabels="productCreateModalLabel">Add
                            product
                        </ProductForm>
                    </div>
                </div>
            </div>
        </div>
        <div class="card table-responsive">
            <table class="table table-borderless">
                <thead>
                    <tr class="table-primary">
                        <th>Product code</th>
                        <th>Image</th>
                        <th>Product's name</th>
                        <th>Price</th>
                        <th>Date created</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(product, index) in filteredProducts" :key="product._id">
                        <td>{{ product._id }}</td>
                        <td><img :src="product.image.img_data" alt=""></td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.price.toLocaleString('it-IT', {
                            style:
                                'currency', currency: 'VND'
                        }) }}</td>
                        <td>{{ product.date_created }}</td>
                        <td>
                            <button class="btn btn-outline-primary mx-1 m-auto" data-bs-toggle="modal"
                                :data-bs-target="'#productEditModal' + product._id">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn btn-outline-danger mx-1 m-auto" @click="deleteProduct(product._id)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                        <!-- Modal product Edit-->
                        <div class="modal fade" :id="'productEditModal' + product._id" tabindex="-1"
                            aria-labelledby="productEditModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered modal-lg">
                                <div class="modal-content">
                                    <ProductForm :product="product" @submit:product="updateProduct"
                                        @delete:product="deleteProduct" modalLabels="productEditModalLabel">
                                        Update product
                                    </ProductForm>
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
import ProductService from "@/services/product.service";

import ProductForm from "@/components/product/ProductForm.vue";
import inputSearch from "@/mixins/inputSearch";
import { useAuthStore } from '@/stores/store';
export default {
    components: {
        ProductForm
    },
    data() {
        return {
            authStore: useAuthStore(),
            products: [],
        };
    },
    mixins: [inputSearch],
    computed: {
        filteredProducts() {
            if (!this.searchText) return this.products;
            return this.products.filter((product) =>
                this.removeAccents(product.name).toLowerCase()
                    .includes(this.removeAccents(this.searchText).toLowerCase())
            );
        },
    },
    methods: {
        async getProductAll() {
            this.products = await ProductService.productAll();
        },
        async createProduct(data) {
            await ProductService.createProduct(data);
            this.$router.go();
        },
        async deleteProduct(id) {
            await ProductService.deleteProduct(id);
            this.$router.go();
        },
        async updateProduct(data) {
            await ProductService.updateProduct(data);
            this.$router.go();
        },
    },
    created() {
        this.getProductAll();
    },
}
</script>
<style scoped>
img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
}
</style>