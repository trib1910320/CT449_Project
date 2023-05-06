<template>
    <div v-if="this.authStore.admin" class="card">
        <div class="row my-3">
            <div class="col-5">
                <InputSearch class="mx-5" v-model="searchText" />
            </div>
            <div class="col-7 text-end">
                <button class="btn btn-primary mx-5" data-bs-toggle="modal" data-bs-target="#typeCreateModal">
                    <i class="fa-solid fa-folder-plus"></i> Add type
                </button>
            </div>
            <!-- Modal Type Create-->
            <div class="modal fade" id="typeCreateModal" tabindex="-1" aria-labelledby="typeCreateModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <TypeForm :type="{}" @submit:type="createType" modalLabels="typeCreateModalLabel">Add type
                        </TypeForm>
                    </div>
                </div>
            </div>
        </div>
        <div class="card table-responsive">
            <table class="table table-borderless">
                <thead>
                    <tr class="table-primary">
                        <th></th>
                        <th>Type code</th>
                        <th>Iamge</th>
                        <th>Type name</th>
                        <th>Date created</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(type, index) in filteredTypes" :key="type._id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ type._id }}</td>
                        <td><img :src="type.image.img_data" alt=""></td>
                        <td>{{ type.name }}</td>
                        <td>{{ type.date_created }}</td>
                        <td>
                            <button class="btn btn-outline-primary mx-1 m-auto" data-bs-toggle="modal"
                                :data-bs-target="'#typeEditModal' + type._id">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn btn-outline-danger mx-1 m-auto" @click="deleteType(type._id)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                        <!-- Modal Type Edit-->
                        <div class="modal fade" :id="'typeEditModal' + type._id" tabindex="-1"
                            aria-labelledby="typeEditModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered modal-lg">
                                <div class="modal-content">
                                    <TypeForm :type="type" @submit:type="updateType" @delete:type="deleteType"
                                        modalLabels="typeEditModalLabel">
                                        Update type
                                    </TypeForm>
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
import TypeService from "@/services/type.service";

import TypeForm from "@/components/product/TypeForm.vue";
import inputSearch from "@/mixins/inputSearch";
import { useAuthStore } from '@/stores/store';
export default {
    components: {
        TypeForm
    },
    data() {
        return {
            authStore: useAuthStore(),
            types: []
        };
    },
    mixins: [inputSearch],
    computed: {
        filteredTypes() {
            if (!this.searchText) return this.types;
            return this.types.filter((type) =>
                this.removeAccents(type.name).toLowerCase()
                    .includes(this.removeAccents(this.searchText).toLowerCase())
            );
        },
    },
    methods: {
        async getTypeAll() {
            this.types = await TypeService.typeAll();
        },
        async createType(data) {
            await TypeService.createType(data);
            this.$router.go();
        },
        async deleteType(id) {
            await TypeService.deleteType(id);
            this.$router.go();
        },
        async updateType(data) {
            await TypeService.updateType(data);
            this.$router.go();
        }
    },
    created() {
        this.getTypeAll();
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