<template>
    <div v-if="this.authStore.admin" class="card">
        <div class="row my-3">
            <div class="col-5">
                <InputSearch class="mx-5" v-model="searchText" />
            </div>
            <div class="col-7 text-end">
                <button class="btn btn-primary mx-5" data-bs-toggle="modal" data-bs-target="#userCreateModal">
                    <i class="fa-solid fa-folder-plus"></i> Add user
                </button>
            </div>
            <!-- Modal User Create-->
            <div class="modal fade" id="userCreateModal" tabindex="-1" aria-labelledby="userCreateModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <UserForm :user="{}" @submit:user="createUser" modalLabels="userCreateModalLabel">Add user
                        </UserForm>
                    </div>
                </div>
            </div>
        </div>
        <div class="card table-responsive">
            <table class="table table-borderless">
                <thead>
                    <tr class="table-primary">
                        <th></th>
                        <th>Avatar</th>
                        <th>User name</th>
                        <th>Phone number</th>
                        <th>Address</th>
                        <th>Gender</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in filteredUsers" :key="user._id">
                        <td>{{ index + 1 }}</td>
                        <td><img :src="user.avatar.avatar_data" alt=""></td>
                        <td>{{ user.name.fullname }}</td>
                        <td>{{ user.phone }}</td>
                        <td>{{ user.address }}</td>
                        <td>{{ user.gender }}</td>
                        <td>
                            <button class="btn btn-outline-primary mx-1" data-bs-toggle="modal"
                                :data-bs-target="'#managerUserModal' + user._id">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn btn-outline-danger" @click="deleteUser(user._id)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                        <!-- Modal User-->
                        <div class="modal fade" :id="'managerUserModal' + user._id" tabindex="-1"
                            aria-labelledby="managerUserModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered modal-lg">
                                <div class="modal-content">
                                    <UserForm :user="user" @submit:user="updateUser" @delete:user="deleteUser" modalLabels="managerUserModalLabel">
                                        Update
                                    </UserForm>
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
import UserService from "@/services/user.service";
import AuthService from "@/services/auth.service";

import UserForm from "@/components/account/UserForm.vue";
import inputSearch from "@/mixins/inputSearch";
import { useAuthStore } from '@/stores/store';
export default {
    components: {
        UserForm
    },
    data() {
        return {
            authStore: useAuthStore(),
            users: []
        };
    },
    mixins: [inputSearch],
    computed: {
        filteredUsers() {
            if (!this.searchText) return this.users;
            return this.users.filter((user) =>
                this.removeAccents(user.name.fullname).toLowerCase()
                    .includes(this.removeAccents(this.searchText).toLowerCase())
            );
        },
    },
    methods: {
        async getUserAll() {
            this.users = await UserService.getUsers();
        },
        async updateUser(data) {
            try {
                await UserService.updateUser(data._id, data);
                this.$router.go();
            } catch (error) {
                alert(error.response.data.message)
            }
        },
        async createUser(data) {
            try {
                await AuthService.register(data);
                this.$router.go();
            } catch (error) {
                alert(error.response.data.message)
            }
        },
        async deleteUser(id) {
            try {
                await UserService.deleteUser(data._id, data);
            } catch (error) {
                alert(error.response.data.message)
            }
        },
    },
    created() {
        this.getUserAll();
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