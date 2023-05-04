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
        children: [
            {
                path: "",
                name: "orders",
                component: loadView('Orders'),
            },
            {
                path: "id=:id",
                name: "orders.detail",
                // component: loadView('OrderDetail'),
                props: true,
            }
        ],
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
        path: "/manager",
        name: "manager",
        // component: loadView('News')
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
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (!authStore.login) {
            next({ name: 'account' })
        } else {
            next() // go to wherever I'm going
        }
    } else {
        next() // does not require auth, make sure to always call next()!
    }
})
export default router;
