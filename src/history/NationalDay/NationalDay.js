/*
 * @Author: Elk
 * @Date: 2023-05-11 19:22:48
 * @FilePath: /yaame-h5/src/pages/NationalDay/NationalDay.js
 * @Description: 
 */
import Vue from 'vue';
import App from './NationalDay.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import '../../components/third/infinite-scroll/infinite-scroll';
import { Lazyload } from 'vant';
Vue.use(Lazyload, {
    filter: {
        thumbnail(listener, options) {
            const isPicOss = /maybe-img.maybe1314.net/;
            if (isPicOss.test(listener.src)) {
                listener.src = `${listener.src}?iopcmd=thumbnail&type=4&width=120`;
            }
        }
    }
});
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
document.body.style.background = '#076837';
new Vue({
    render: h => h(App),
}).$mount('#app');