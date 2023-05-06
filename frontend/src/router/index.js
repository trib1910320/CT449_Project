import { createWebHistory, createRouter } from "vue-router";
import { useAuthStore } from '@/stores/store';

function loadView(view) {
    return () => import(`@/views/${view}.vue`)
}

const routes = [
    {
        path: "/",
        name: "home",
        component: loadView('Home'),
        alias: ["/home"]
    },
    {
        path: "/products",
        children: [
            {
                path: '',
                name: "products",
                component: loadView('Products'),
            },
            {
                path: "type=:type",
                name: "products.type",
                component: loadView('Products'),
                props: true,
            },
            {
                path: ":id",
                name: "products.detail",
                component: loadView('ProductDetail'),
                props: true,
            },
        ],
    },
    {
        path: "/cart",
        name: "cart",
        component: loadView('Cart'),
    },
    {
        path: "/orders",
        name: "orders",
        component: loadView('Orders'),
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/inspiration",
        name: "inspiration",
        component: loadView('Inspiration')
    },
    {
        path: "/manage",
        name: "manage",
        children: [
            {
                path: 'users',
                name: "manage.users",
                component:() => import('@/views/manage/ManageUser.vue'),
            },
            {
                path: "orders",
                name: "manage.orders",
                component:() => import('@/views/manage/ManageOrder.vue'),
            },
            {
                path: "products",
                name: "manage.products",
                component:() => import('@/views/manage/ManageProduct.vue'),
            },
            {
                path: "types",
                name: "manage.types",
                component:() => import('@/views/manage/ManageType.vue'),
            },
            {
                path: "toppings",
                name: "manage.toppings",
                component:() => import('@/views/manage/ManageTopping.vue'),
            },
        ],
        meta: {
            requiresAuth: true,
            requiresAdmin: true
        }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: loadView('NotFound'),
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!authStore.login) next({ name: 'home' })
        else next()
    } else {
        next()
    }
})
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (authStore.admin != true) next({ name: 'home' })
        else next()
    } else {
        next()
    }
})
export default router;
