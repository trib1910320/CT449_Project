import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        userid: null,
        admin: false,
        token: null,
        login: false,
    }),

    actions: {
        logIn(data) {
            this.userid = data.userid;
            this.token = data.AccessToken;
            this.admin = data.admin;
            this.login = true;
        },
        logOut() {
            this.userid = null;
            this.admin = false;
            this.token = null;
            this.login = false;
        }
    },
    persist: true,
});

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: []
    }),
    actions: {
        addCart(data) {
            this.cart = data;
        },
        updateCart(index,data) {
            this.cart[index] = data;
        },
        deleteCart(index) {
            this.cart.splice(index, 1);
        },
        resetCart() {
            this.cart = []
        },
    },
    persist: true,
})