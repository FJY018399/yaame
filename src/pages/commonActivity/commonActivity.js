import Vue from "vue";
import App from "./commonActivity.vue";
import "./../../assets/css/reset.css";
import FastClick from "fastclick";
import { Lazyload } from "vant";

Vue.use(Lazyload, {
	filter: {
		thumbnail(listener, options) {
			const isPicOss = /pikpik-oss.weli010.cn/;
			if (isPicOss.test(listener.src)) {
				listener.src = `${listener.src}?iopcmd=thumbnail&type=4&width=60`;
			}
		},
	},
});

if ("addEventListener" in document) {
	document.addEventListener(
		"DOMContentLoaded",
		function () {
			FastClick.attach(document.body);
		},
		false
	);
}
document.body.style.backgroundColor = "#fff";

new Vue({
	render: (h) => h(App),
}).$mount("#app");
