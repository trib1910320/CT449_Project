<template>
    <footer class="container-fluid">
        <div class="row align-items-center py-3 mx-2">
            <div class="col-12 col-lg-8">
                <p class="footer_text mb-0"></p>
                <p class="footer_text">Dự án cuối kì học phần Phát triển ứng dụng Web - Web Coffee Shop</p>
                <p class="footer_text">Người đại diện: <b>LÊ DƯƠNG TRÍ</b></p>
                <p class="footer_text">Địa chỉ: Đường 3/2, phường Xuân Khánh, quận Ninh Kiều, tp Cần Thơ</p>
                <p class="footer_text">Điện thoại: (028) 1234 1234 | Email: coffeeshop@gmail.com</p>
                <p class="footer_text">&copy; 05/2023 Dự án cuối kì học phần Phát triển ứng dụng Web - nhóm 5</p>
                <p></p>
            </div>
            <div class="col-12 col-lg-4 text-center">
                <router-link :to="{ name: 'home' }">
                    <img src="@/assets/logo.jpg" class="logo rounded-circle" alt="CoffeeHouse">
                </router-link>
                <p class="text-white fst-italic mt-3">Coffee Shop &copy;2023. Developed by Tri</p>
            </div>
        </div>
    </footer>
</template>
<script>
export default {

}
</script>
<style scoped>
footer {
    background-color: rgba(0, 0, 0, 0.8);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

.footer_text {
    color: white;
    text-align: justify;
    font-size: 13px;
    margin-bottom: 5px;
}

.logo {
    width: 100px;
}
</style>