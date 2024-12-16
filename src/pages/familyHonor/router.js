import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: 'index',
        },
        {
            path: '/index',
            name: 'index',
            component: () => import('./views/indexPage.vue'),
        },
        {
            path: '/rule',
            name: 'rule',
            component: () => import('./views/rulePage.vue'),
        },
        {
            path: '/ranking',
            name: 'ranking',
            component: () => import('./views/rankingPage.vue'),
        },
    ],
});

export default router;
