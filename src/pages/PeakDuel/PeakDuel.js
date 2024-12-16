import Vue from 'vue';
import App from './index.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import router from './router.js';
import { Swipe, SwipeItem, ActionSheet, Lazyload, Tab, Tabs } from 'vant';
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(ActionSheet);
Vue.use(Lazyload);
Vue.use(Tab);
Vue.use(Tabs);
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
document.body.style.backgroundColor = '#000110';
new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
