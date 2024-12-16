/*
 * @Author: Se7enElk
 * @Date: 2021-12-24 15:28:24
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-12-24 15:28:25
 * @FilePath: /peanut_h5/src/pages/greetingList/greetingList.js
 * @Description: 
 */
import Vue from 'vue';

import App from './greetingList.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import '../../components/third/infinite-scroll/infinite-scroll';

import { NoticeBar, Loading } from 'vant';
Vue.use(NoticeBar);
Vue.use(Loading);
;

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}

FastClick.prototype.focus = function (targetElement) {
    targetElement.focus();
};

new Vue({
    render: h => h(App),
}).$mount('#app');