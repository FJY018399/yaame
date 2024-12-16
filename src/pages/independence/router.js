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
            component: () => import('./components/index.vue'),
            redirect: './index/task',
            children: [
                {
                    path: 'task',
                    name: 'task',
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
    ]
})

export default router