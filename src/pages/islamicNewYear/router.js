/*
 * @Author: Elk
 * @Date: 2024-06-20 16:33:00
 * @FilePath: /yaame-h5/src/pages/islamicNewYear/router.js
 * @Description:
 */
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routers = new VueRouter({
	routes: [
		{
			path: "",
			redirect: "/home",
		},
		{
			path: "/home",
			name: "home",
			component: () => import("./views/home"),
            redirect: '/home/index',
			children: [
				{
					path: "index",
					name: "index",
					component: () => import("./views/index"),
				},
				{
					path: "progress",
					name: "progress",
					component: () => import("./views/progress"),
				},
				{
					path: "rank",
					name: "rank",
					component: () => import("./views/rank"),
				},
			],
		},
        { // 三、排行奖励
			path: "/reward",
			name: "reward",
			component: () => import("./views/reward.vue"),
		},
	],
});
export default routers;
