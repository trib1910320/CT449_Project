<template>
    <div class="d-flex">
        <img :src="this.user.avatar?.avatar_data" class="avatarUser" alt="Avatar User">
        <h5 class="m-2">{{ this.user.name?.fullname }}</h5>
    </div>
</template>
<script>
import UserService from "@/services/user.service";

export default {
    props: {
        userid: { type: String, required: true },
    },
    data() {
        return {
            user: [],
        }
    },
    methods: {
        async getUser(id) {
            this.user = await UserService.getOne(id);
        },
    },
    created() {
        this.getUser(this.userid);
    },

}

</script>
<style scoped>
.img {
    height: 40px;
    width: 40px;
    border-radius: 100%;
}

.avatarUser {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    border: 1px solid rgba(0, 0, 0, 0.5);
}

</style>