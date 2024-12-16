import Vue from 'vue';
import VueRouter from 'vue-router'
import Index from './index.vue'
import reward from './components/reward.vue'

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
            component: Index,
        },
        {
            path: '/reward',
            name: 'reward',
            component: reward,
        },
    ]
})

export default router