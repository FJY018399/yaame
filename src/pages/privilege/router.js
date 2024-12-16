import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routers = new VueRouter({
	routes: [
		{
			path: "",
			redirect: "/privilege",
		},
		{
			path: "/privilege",
			name: "privilege",
			component: () => import("./views/privilege"),
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
			component: () => import("./views/privilegeDetails.vue"),
		},
	],
});

export default routers;
