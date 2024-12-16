import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routers = new VueRouter({
    routes: [
        {
            path: "",
            redirect: "/index",
        },
        {
            path: "/index",
            name: "index",
            component: () => import("./views/index"),
            meta: {
                title: "April Fool's Day",
            },
        },
        {
            path: "/prize",
            name: "prize",
            meta: {
                title: "April Fool's Day",
            },
            component: () => import("./views/prize.vue"),
        },
    ],
});

export default routers;
