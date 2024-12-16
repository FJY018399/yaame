import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routers = new VueRouter({
	routes: [
		{
			path: "",
			redirect: "/vip",
		},
		{
			path: "/vip",
			name: "vip",
			component: () => import("./views/vip"),
			meta: {
				title: "Yaame Privilege",
			},
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
			path: "/details",
			name: "details",
			meta: {
				title: "Details",
			},
			component: () => import("./views/details.vue"),
		},
	],
});

export default routers;
