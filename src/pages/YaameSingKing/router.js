/*
 * @Author: Elk
 * @Date: 2024-05-09 10:39:00
 * @FilePath: /yaame-h5/src/pages/YaameSingKing/router.js
 * @Description: 歌王路由文件
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
			meta: {
				title: "Yaame King Of Singing",
			},
		},
		{
			path: "/rank",
			name: "rank",
			meta: {
				title: "Rank",
			},
			component: () => import("./views/rank.vue"),
		},
        {
			path: "/task",
			name: "Task",
			meta: {
				title: "task",
			},
			component: () => import("./views/task.vue"),
		},
        {
			path: "/exchange",
			name: "Exchange",
			meta: {
				title: "exchange",
			},
			component: () => import("./views/exchange.vue"),
		},
        {
			path: "/reward",
			name: "Reward",
			meta: {
				title: "reward",
			},
			component: () => import("./views/reward.vue"),
		},
	],
});

export default routers;
