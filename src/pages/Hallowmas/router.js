import Vue from 'vue';
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: 'index',
        },
        {
            path: '/index',
            name: 'index',
            component: () => import('./index.vue'),
            redirect: './index/game',
            children: [
                {
                    path: 'game',
                    name: 'game',
                    component: () => import('./components/game.vue'),
                },
                {
                    path: 'ranking',
                    name: 'ranking',
                    component: () => import('./components/ranking.vue'),
                }
            ]
        },
        {
            path: '/rule',
            name: 'rule',
            component: () => import('./components/rule.vue'),
        },
        {
            path: '/party',
            name: 'party',
            component: () => import('./components/party.vue'),
        }
    ]
})

export default router