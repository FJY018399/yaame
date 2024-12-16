/*
 * @Author: Elk
 * @Date: 2024-08-28 18:31:09
 * @FilePath: /yaame-h5/src/pages/constellation/router.js
 * @Description:
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
const routers = new VueRouter({
    routes: [
        {
            path: '',
            redirect: '/index',
        },
        {
            path: '/index',
            name: 'index',
            meta: {
                title: 'index',
            },
            component: () => import('./views/index.vue'),
            redirect: '/index/reward',
            children: [
                {
                    path: 'rank',
                    name: 'rank',
                    component: () => import('./views/rankList.vue'),
                },
                {
                    path: 'reward',
                    name: 'reward',
                    component: () => import('./views/reward.vue'),
                },
            ],
        },
        {
            path: '/CrystalBall',
            name: 'CrystalBall',
            meta: {
                title: 'CrystalBall',
            },
            component: () => import('./views/CrystalBall.vue'),
        },
        {
            path: '/rule',
            name: 'rule',
            meta: {
                title: 'rule',
            },
            component: () => import('./views/rulePage.vue'),
        },
    ],
});

export default routers;
