<template>
    <div class="row">
        <!-- Carousel -->
        <div id="demo" class="carousel slide" data-bs-ride="carousel">

            <!-- Indicators/dots -->
            <div class="carousel-indicators">
                <button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="3"></button>
            </div>

            <!-- The slideshow/carousel -->
            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src="../assets/banner/web_desktop.jpg" alt="" class="d-block w-100">
                </div>
                <div class="carousel-item">
                    <img src="../assets/banner/banner_web_moi.jpg" alt="" class="d-block w-100">
                </div>
                <div class="carousel-item">
                    <img src="../assets/banner/banner_web_moi_2.jpg" alt="" class="d-block w-100">
                </div>
                <div class="carousel-item">
                    <img src="../assets/banner/banner_web_moi_3.jpg" alt="" class="d-block w-100">
                </div>
            </div>

            <!-- Left and right controls/icons -->
            <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </div>
        <div v-if="filteredProductsCount > 0" class="row justify-content-center my-5">
            <div class="text-center fs-2 text-black fw-bold">
                <span>Sản phẩm mới</span>
            </div>
            <ProductCard v-for="(product) in this.products" :key="product._id" :product="product" />
        </div>
        <div class="card my-2">
            <div class="row my-5">
                <div class="col-6">
                    <img src="../assets/kombucha.png" alt="">
                </div>
                <div class="col-6">
                    <img src="../assets/kombucha-headline.png" alt="">
                    <p>Với nền trà không caffeine 100% hoa Hibiscus tự nhiên, kết hợp cùng trà lên men cao cấp Kombucha
                        Detox và
                        hương vị trái cây tươi mát, Hi-Tea Kombucha Detox là lựa chọn cho người trẻ hiện đại quan tâm sức
                        khoẻ
                        và yêu chiều bản thân. Đặc biệt, dòng sản phẩm chứa nhiều vitamin, chất chống oxy hóa, các loại axit
                        hữu
                        cơ và lợi khuẩn giúp thanh lọc cơ thể, hỗ trợ gọn dáng, sáng da hiệu quả.sChọn Hi-Tea Kombucha Detox
                        là
                        chọn "Say Hi" với một trải nghiệm detox thật dễ dàng và tiện lợi.</p>
                    <router-link class="btn btn-warning" style="width: 100%;"
                        :to="{ name: 'products.type', params: { type: '641c1a8a8d07f521f438f93b' } }">
                        Thử ngay
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import ProductService from "@/services/product.service";

import ProductCard from "@/components/product/ProductCard.vue";
export default {
    components: {
        ProductCard
    },
    data() {
        return {
            products: [],
        };
    },
    computed: {
        filteredProductsCount() {
            return this.products.length;
        },
    },
    methods: {
        async getProducts() {
            this.products = await ProductService.productNew();
        },
    },
    mounted() {
        this.getProducts();
    },
}
</script>
<style scoped></style>