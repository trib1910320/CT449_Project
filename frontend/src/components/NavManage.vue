<template>
    <div class="card">
        <div class="card-header">
            <h4 class="fw-bold text-primary">Manage</h4>
        </div>
        <div class="list-group">
            <router-link class="list-group-item btn btn-outline-warning" :class="[
                ($route.name == 'manage.users') ? { active: true } : '']" :to="{
        name: 'manage.users'
    }">
                <i class="fa-solid fa-user"></i> Users
            </router-link>

            <router-link class="list-group-item btn btn-outline-warning" :class="[
                ($route.name == 'manage.orders') ? { active: true } : '']" :to="{
        name: 'manage.orders'
    }">
                <i class="fa-solid fa-bag-shopping"></i> Orders
            </router-link>

            <router-link class="list-group-item btn btn-outline-warning" :class="[
                    ($route.name == 'manage.products') ? { active: true } : '']" :to="{
                name: 'manage.products'
            }">
                <i class="fa-solid fa-mug-hot"></i> Products
            </router-link>

            <router-link class="list-group-item btn btn-outline-warning" :class="[
                    ($route.name == 'manage.types') ? { active: true } : '']" :to="{
                name: 'manage.types'
            }">
                <i class="fa-solid fa-font"></i> Types
            </router-link>

            <router-link class="list-group-item btn btn-outline-warning" :class="[
                    ($route.name == 'manage.toppings') ? { active: true } : '']" :to="{
                name: 'manage.toppings'
            }">
                <i class="fa-solid fa-glass-water"></i> Toppings
            </router-link>
        </div>
    </div>
</template>
<script>

export default {

}
</script>
<style scoped>
.list-group-item,
.list-group {
    border-radius: 0;
    font-weight: bold;
    font-size: 18px;
}
.list-group-item.active{
    background-color: orange;
    border: 0;
}
</style>