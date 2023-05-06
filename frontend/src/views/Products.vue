<template>
    <div class="mx-auto my-2 col-4">
        <InputSearch v-model="searchText" />
    </div>
    <div class="text-center fs-2 text-black fw-bold">
        <i class="fa-solid fa-list mx-3" style="color: orange;"></i>
        <span>List of products</span>
    </div>
    <ul v-if="filteredTypesCount > 0" class="nav justify-content-center">
        <li v-for="(type) in this.types" :key="type._id" class="nav-item">
            <router-link class="nav-link navbar-collapse text-center" aria-current="page"
                :class="[($route.params.type == type._id) ? { active: true } : '']"
                :to="{ name: 'products.type', params: { type: type._id } }">
                <div class="d-flex flex-column">
                    <img class="mx-auto" :src="type.image.img_data" alt="" style="width: 60px;">
                    <p class="text-type">{{ type.name }}</p>
                </div>
            </router-link>
        </li>
    </ul>
    <div v-if="filteredProductsCount > 0" class="row justify-content-center">
        <ProductCard v-for="(product) in filteredProducts" :key="product._id" :product="product" />
    </div>
</template>
<script>
import ProductService from "@/services/product.service";
import TypeService from "@/services/type.service";

import ProductCard from "@/components/product/ProductCard.vue";
import inputSearch from "@/mixins/inputSearch";
export default {
    components: {
        ProductCard
    },
    props: {
        type: { type: String, default: null },
    },
    data() {
        return {
            products: [],
            types: [],
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
        filteredTypesCount() {
            return this.types.length;
        },
        filteredProductsCount() {
            return this.products.length;
        },
    },
    methods: {
        async getProducts() {
            if (this.type) {
                this.products = await ProductService.productByType(this.type);
            } else if (this.search) {
                this.products = await ProductService.productByName(this.search);
            } else {
                this.products = await ProductService.productAll();
            }
        },
        async getTypes() {
            this.types = await TypeService.typeAll();
        },
    },
    mounted() {
        this.getProducts();
        this.getTypes();
    },
}
</script>
<style scoped>
.nav-item {
    width: 120px;
}

p.text-type {
    color: orange;
    font-size: 18px;
    font-weight: bold;
    margin-top: 5px;
}

li a.active {
    background-color: orange;
    border-radius: 10px;
}

a.active p.text-type {
    color: white;
}
</style>