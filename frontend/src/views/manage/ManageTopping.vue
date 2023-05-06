<template>
    <div v-if="this.authStore.admin" class="card">
        <div class="row my-3">
            <div class="col-5">
                <InputSearch class="mx-5" v-model="searchText" />
            </div>
            <div class="col-7 text-end">
                <button class="btn btn-primary mx-5" data-bs-toggle="modal" data-bs-target="#toppingCreateModal">
                    <i class="fa-solid fa-folder-plus"></i> Add topping
                </button>
            </div>
            <!-- Modal topping Create-->
            <div class="modal fade" id="toppingCreateModal" tabindex="-1" aria-labelledby="toppingCreateModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <ToppingForm :topping="{}" @submit:topping="createTopping" modalLabels="toppingCreateModalLabel">Add
                            topping
                        </ToppingForm>
                    </div>
                </div>
            </div>
        </div>
        <div class="card table-responsive">
            <table class="table table-borderless">
                <thead>
                    <tr class="table-primary">
                        <th></th>
                        <th>Code Topping</th>
                        <th>Topping's name</th>
                        <th>Price</th>
                        <th>Date created</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(topping, index) in filteredToppings" :key="topping._id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ topping._id }}</td>
                        <td>{{ topping.name }}</td>
                        <td>{{ topping.price.toLocaleString('it-IT', {
                            style:
                                'currency', currency: 'VND'
                        }) }}</td>
                        <td>{{ topping.date_created }}</td>
                        <td>
                            <button class="btn btn-outline-primary mx-1 m-auto" data-bs-toggle="modal"
                                :data-bs-target="'#toppingEditModal' + topping._id">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn btn-outline-danger mx-1 m-auto" @click="deleteTopping(topping._id)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                        <!-- Modal topping Edit-->
                        <div class="modal fade" :id="'toppingEditModal' + topping._id" tabindex="-1"
                            aria-labelledby="toppingEditModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered modal-lg">
                                <div class="modal-content">
                                    <ToppingForm :topping="topping" @submit:topping="updateTopping"
                                        @delete:topping="deleteTopping" modalLabels="toppingEditModalLabel">
                                        Update topping
                                    </ToppingForm>
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
import ToppingService from "@/services/topping.service";

import ToppingForm from "@/components/product/ToppingForm.vue";
import inputSearch from "@/mixins/inputSearch";
import { useAuthStore } from '@/stores/store';
export default {
    components: {
        ToppingForm
    },
    data() {
        return {
            authStore: useAuthStore(),
            toppings: [],
        };
    },
    mixins:[inputSearch],
    computed: {
        filteredToppings() {
            if (!this.searchText) return this.toppings;
            return this.toppings.filter((topping) =>
                this.removeAccents(topping.name).toLowerCase()
                    .includes(this.removeAccents(this.searchText).toLowerCase())
            );
        },
    },
    methods: {
        async getToppingAll() {
            this.toppings = await ToppingService.toppingAll();
        },
        async createTopping(data) {
            await ToppingService.createTopping(data);
            this.$router.go();
        },
        async deleteTopping(id) {
            await ToppingService.deleteTopping(id);
            this.$router.go();
        },
        async updateTopping(data) {
            await ToppingService.updateTopping(data);
            this.$router.go();
        }
    },
    created() {
        this.getToppingAll();
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