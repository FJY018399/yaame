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
            redirect: './index/task',
            children: [
                {
                    path: 'task',
                    name: 'task',
                    component: () => import('./components/task.vue'),
                },
                {
                    path: 'ranking',
                    name: 'ranking',
                    component: () => import('./components/ranking.vue'),
                }
            ]
        },
        {
            path: '/reward',
            name: 'reward',
            component: () => import('./components/reward.vue'),
        },
    ]
})

export default router