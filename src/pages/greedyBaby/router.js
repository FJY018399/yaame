import Vue from 'vue';
import VueRouter from 'vue-router';
import greedyHome from './greedyBaby.vue'
Vue.use(VueRouter);

const routers = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/greedyHome',
    },
    {
      path: '/greedyHome',
      name: 'greedyHome',
      component: greedyHome,
      redirect: 'greedyBabyHome',
      children: [
        {
          path: '/greedyBabyHome',
          name: 'greedyBabyHome',
          component: () => import('./components/greedyBabyHome.vue')
        },
        {
            path: '/gameReward',
            name: 'gameReward',
            component: () => import('./components/gameReward.vue')
        }
      ]
    }
  ],
});

export default routers;