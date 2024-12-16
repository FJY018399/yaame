/*
 * @Author: Elk
 * @Date: 2024-06-20 16:33:00
 * @FilePath: /yaame-h5/src/pages/withdraw/router.js
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
			path: "/method",
			name: "method",
			component: () => import("./views/method"),
		},
        {
			path: "/create",
			name: "create",
			component: () => import("./views/create"),
		},
        {
			path: "/record",
			name: "record",
			component: () => import("./views/record"),
		},
	],
});

// routers.beforeEach((to, from, next) => {
//     // if (from && from.name === 'index') {
//     //     if (to.name === 'method') {
//     //         next();
//     //         return;
//     //     }
//     // }
//     next();
// })

export default routers;
