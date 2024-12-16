/*
 * @Author: Elk
 * @Date: 2024-05-17 17:23:07
 * @FilePath: /yaame-h5/src/pages/AbundantHarvest/router.js
 * @Description: 
 */
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routers = new VueRouter({
	routes: [
		{
			path: "",
			redirect: "/index",
		},
		{
			path: "/index",
			name: "index",
			component: () => import("./views/index"),
		},
		{
			path: "/rank",
			name: "rank",
			component: () => import("./views/rank.vue"),
		},
		{
			path: "/task",
			name: "task",
			component: () => import("./views/task.vue"),
		},
		{
			path: "/exchange",
			name: "exchange",
			component: () => import("./views/exchange.vue"),
		},
		{
			// 奖励
			path: "/award",
			name: "award",
			component: () => import("./views/award.vue"),
		},
        {
			path: "/send",
			name: "send",
			component: () => import("./views/send.vue"),
		},
        {
			path: "/diamonds",
			name: "diamonds",
			component: () => import("./views/diamonds.vue"),
		},
	],
});

export default routers;
