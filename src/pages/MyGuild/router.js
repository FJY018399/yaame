/*
 * @Author: Elk
 * @Date: 2024-08-23 15:10:51
 * @FilePath: /yaame-h5/src/pages/MyGuild/router.js
 * @Description:
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routers = new VueRouter({
    routes: [
        {
            path: '',
            redirect: '/WalletsMain',
        },
        {
            path: '/WalletsMain',
            name: 'WalletsMain',
            component: () => import('./views/WalletsMain'),
        },
        {
            path: '/Regulations',
            name: 'Regulations',
            component: () => import('./views/Regulations'),
        },
        {
            path: '/MyIncome',
            name: 'MyIncome',
            component: () => import('./views/MyIncome'),
        },
        {
            path: '/AgencyRevenue',
            name: 'AgencyRevenue',
            component: () => import('./views/AgencyRevenue'),
        },
        {
            path: '/ContactUs',
            name: 'ContactUs',
            component: () => import('./views/ContactUs'),
        },
        {
            path: '/GuildMembers',
            name: 'GuildMembers',
            component: () => import('./views/GuildMembers'),
        },
        {
            path: '/GuildInvite',
            name: 'GuildInvite',
            component: () => import('./views/GuildInvite'),
        },
        {
            path: '/MyIncomeMain',
            name: 'MyIncomeMain',
            redirect: '/MyIncomeAll',
            component: () => import('./views/MyIncomeMain'),
            children: [
                {
                    path: '/MyIncomeAll',
                    name: 'MyIncomeAll',
                    component: () => import('./views/MyIncomeAll'),
                },
                {
                    path: '/flow',
                    name: 'flow',
                    component: () => import('./views/flow'),
                },
            ],
        },
        {
            path: '/AgencyRevenueAll',
            name: 'AgencyRevenueAll',
            component: () => import('./views/AgencyRevenueAll'),
        },
        {
            // 管理员
            path: '/intendantPage',
            name: 'intendantPage',
            component: () => import('./views/intendantPage'),
        },
        {
            // 添加管理员
            path: '/addIntendant',
            name: 'addIntendant',
            component: () => import('./components/addIntendant.vue'),
        },
    ],
});

export default routers;
