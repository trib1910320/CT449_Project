<template>
    <nav class="navbar bg-header sticky-top row">
        <!-- Logo -->
        <div class="col-3 col-lg-3 text-center">
            <router-link :to="{ name: 'home' }">
                <img src="@/assets/logo.jpg" class="logo rounded-circle" alt="CoffeeHouse">
            </router-link>
        </div>
        <!-- Navigation -->
        <div class="col-6 col-lg-6 d-flex justify-content-center">
            <div class="my-auto mx-1">
                <router-link class="btn btn-outline-light p-3 fs-5 fw-bolder"
                    :class="[($route.name == 'home') ? { active: true } : '']" :to="{ name: 'home' }">
                    <i class="fa-solid fa-house"></i> Home
                </router-link>
            </div>
            <div class="my-auto mx-1">
                <router-link class="btn btn-outline-light p-3 fs-5 fw-bolder" :class="[
                    ($route.name == 'products' || $route.name == 'products.type') ? { active: true } : '']"
                    :to="{ name: 'products' }">
                    <i class="fa-solid fa-mug-hot"></i> Product
                </router-link>
            </div>
            <div class="my-auto mx-1">
                <router-link class="btn btn-outline-light p-3 fs-5 fw-bolder"
                    :class="[($route.name == 'inspiration') ? { active: true } : '']" :to="{ name: 'inspiration' }">
                    <i class="fa-solid fa-lightbulb"></i> Inspiration
                </router-link>
            </div>
        </div>
        <!-- User -->
        <div class="col-3 col-lg-3 d-flex">
            <!-- Cart -->
            <div class="my-auto mx-2">
                <router-link class="btn btn-light position-relative" :to="{ name: 'cart'}">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="position-absolute translate-middle badge rounded-pill bg-danger">
                        {{ countCartItem }}
                    </span>
                </router-link>
            </div>
            <!-- Account -->
            <div class="dropdown text-center" v-if="this.authStore.login">
                <button class="btn btn-light" data-bs-toggle="dropdown" aria-expanded="false">
                    <UserCard :userid="this.authStore.userid" />
                </button>
                <ul class="dropdown-menu m-0">
                    <li>
                        <router-link class="btn dropdown-item" :to="{
                            name: 'orders'
                        }">
                            <i class="fa-solid fa-bag-shopping"></i> Orders
                        </router-link>
                    </li>
                    <li>
                        <router-link v-if="this.authStore.admin" class="btn dropdown-item" :to="{
                            name: 'manage.users'
                        }">
                            <i class="fa-solid fa-id-card-clip"></i> Manager
                        </router-link>
                    </li>
                    <li>
                        <button class="btn dropdown-item" @click="logout">
                            <i class="fa-solid fa-right-from-bracket"></i> Log Out
                        </button>
                    </li>
                </ul>
            </div>
            <div class="dropdown text-center" v-else>
                <button class="btn btn-light" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fa-solid fa-user"></i>
                </button>
                <ul class="dropdown-menu m-0">
                    <li>
                        <button class="btn dropdown-item" data-bs-toggle="modal" data-bs-target="#loginModal">
                            <i class="fa-solid fa-right-from-bracket"></i> Login
                        </button>
                    </li>
                    <li>
                        <button class="btn dropdown-item" data-bs-toggle="modal" data-bs-target="#registerModal">
                            <i class="fa-solid fa-user-plus"></i> Register
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- Modal Login-->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <AuthForm :auth="auth" @submit:auth="login" modalLabels="loginModalLabel">
                    Login
                </AuthForm>
            </div>
        </div>
    </div>
    <!-- Modal Reigster-->
    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <UserForm :user="user" @submit:user="register" modalLabels="registerModalLabel">
                    Register
                </UserForm>
            </div>
        </div>
    </div>
</template>
<script>
import AuthForm from "@/components/account/AuthForm.vue";
import UserForm from "@/components/account/UserForm.vue";
import UserCard from "@/components/UserCard.vue";

import UserService from "@/services/user.service";
import AuthService from "@/services/auth.service";
import { useAuthStore, useCartStore } from '@/stores/store';

export default {
    components: {
        AuthForm, UserForm, UserCard
    },
    data() {
        return {
            authStore: useAuthStore(),
            cartStore: useCartStore(),
            auth: {},
            user: {}
        }
    },
    computed: {
        countCartItem() {
            const cart = this.cartStore.cart || [];
            return cart.length;
        }
    },
    methods: {
        async logout() {
            await UserService.logOut();
            this.authStore.logOut();
            this.cartStore.resetCart();
            this.$router.go();
        },
        async login(data) {
            try {
                const response = await AuthService.login(data);
                if (response) {
                    await this.authStore.logIn(response);
                    this.$router.go();
                }
            } catch (error) {
                alert(error.response.data.message)
            }
        },
        async register(data) {
            try {
                await AuthService.register(data);
                this.$router.go();
            } catch (error) {
                alert(error.response.data.message)
            }
        },
    },
    created() {
        this.auth = { phone: null, password: null }
        this.user = {}
    }
}
</script>
<style scoped>
.badge {
    top: 10% !important;
    left: 90%;
    font-size: 0.65rem;
}

.bg-header {
    background-color: var(--bs-yellow);
}

.logo {
    width: 60px;
}

ul li {
    margin: 2px;
}

nav {
    height: fit-content;
    border: 1px solid rgb(210, 210, 210);
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
}

i {
    font-size: 1.4rem;
    padding: 2px;
    color: #007bff;
}

.btn-outline-light,
.btn-outline-light i {
    border: 0;
    color: white;
}

.btn-outline-light:hover i {
    color: orange;
}

.btn-outline-light.active i {
    color: orange;
}
</style>