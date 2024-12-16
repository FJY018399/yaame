/*
 * @Author: Elk
 * @Date: 2024-06-04 17:57:45
 * @FilePath: /yaame-h5/src/pages/EidAlAdha/router.js
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
			path: "/rule",
			name: "rule",
			meta: {
				title: "Rule",
			},
			component: () => import("./views/rule.vue"),
		},
        {
			path: "/index",
			name: "index",
			meta: {
				title: "index",
			},
			component: () => import("./views/index.vue"),
			redirect: '/index/mainHall',
			children: [
				{ // 三、排行
					path: "ranking",
					name: "ranking",
					component: () => import("./views/ranking.vue"),
				},
                {
					path: "mainHall",
					name: "mainHall",
					component: () => import("./views/mainHall.vue"),
				},
                {
					path: "shop",
					name: "shop",
					component: () => import("./views/shop.vue"),
				},
			]
		},
        {
			path: "/preheat",
			name: "preheat",
			meta: {
				title: "preheat",
			},
			component: () => import("./views/preheat.vue"),
		},
		{ // 三、排行奖励
			path: "/award",
			name: "award",
			component: () => import("./views/award.vue"),
		},
		{ // 四、转盘
			path: "/turntable",
			name: "turntable",
			component: () => import("./views/turntable.vue"),
		},
		{ // 五、任务
			path: "/task",
			name: "task",
			component: () => import("./views/task.vue"),
		},
        { // 五、任务
			path: "/yaameShop",
			name: "yaameShop",
			component: () => import("./views/yaameShop.vue"),
		},
        { // 五、任务
			path: "/freeMarket",
			name: "freeMarket",
			component: () => import("./views/freeMarket.vue"),
		},
        { // 五、任务
			path: "/myConsignment",
			name: "myConsignment",
			component: () => import("./views/myConsignment.vue"),
		},
	],
});

export default routers;
