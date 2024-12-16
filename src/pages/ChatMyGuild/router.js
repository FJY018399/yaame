/*
 * @Author: Elk
 * @Date: 2024-08-23 15:10:51
 * @FilePath: /yaame-h5/src/pages/ChatMyGuild/router.js
 * @Description: 
 */
import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routers = new VueRouter({
	routes: [
		{
			path: "",
			redirect: "/Wallets",
		},
		{
			path: "/Wallets",
			name: "Wallets",
			component: () => import("./views/Wallets"),
		},
        {
			path: "/Regulations",
			name: "Regulations",
			component: () => import("./views/Regulations"),
		},
        {
			path: "/MyIncome",
			name: "MyIncome",
			component: () => import("./views/MyIncome"),
		},
        {
			path: "/AgencyRevenue",
			name: "AgencyRevenue",
			component: () => import("./views/AgencyRevenue"),
		},
        {
			path: "/GuildMembers",
			name: "GuildMembers",
			component: () => import("./views/GuildMembers"),
		},
        {
			path: "/GuildInvite",
			name: "GuildInvite",
			component: () => import("./views/GuildInvite"),
		},
	],
});

export default routers;
