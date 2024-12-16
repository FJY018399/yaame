import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routers = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/Home',
        },
        {
            path: '/Home',
            component: () => import('./components/Home.vue')
        },
        {
            path: '/Award',
            component: () => import('./components/Award.vue')
        }

    ],
});

export default routers;