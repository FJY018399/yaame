/*
 * @Author: ZhaoZhiqi
 * @Date: 2023-12-05 13:41:07
 * @LastEditors: ZhaoZhiqi
 * @LastEditTime: 2023-12-12 18:13:22
 * @Description: MyCP router
 * @FilePath: \yaame-h5\src\pages\cp\router.js
 */
import Vue from 'vue';
import VueRouter from 'vue-router'
import Index from './pages/Index'
import Privilege from './pages/Privilege'

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
            path: '/privilege',
            name: 'privilege',
            component: Privilege,
        },
    ]
})

export default router