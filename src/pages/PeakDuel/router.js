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
			path: "/reward",
			name: "reward",
			meta: {
				title: "reward",
			},
			component: () => import("./views/reward.vue"),
		},
        {
			path: "/index",
			name: "index",
			meta: {
				title: "index",
			},
			component: () => import("./views/index.vue"),
		},
	],
});

export default routers;
