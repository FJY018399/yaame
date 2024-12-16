/*
 * @Author: Elk
 * @Date: 2023-04-07 11:00:26
 * @FilePath: /yaame-h5/src/pages/user_agreement/user_agreement.js
 * @Description: 
 */
import Vue from 'vue';
import App from './user_agreement.vue';
import './../../assets/css/reset.css';
// import FastClick from 'fastclick';
import Vuei18n from "vue-i18n";
Vue.use(Vuei18n);
import en from "./locale/en-US";
import id from "./locale/in-ID";
import { getLanguage } from '../../lib/device';
import { getQueryString } from '../../lib/utils';
let locale = getLanguage() || 'en';

if (getQueryString('language')) {
    locale = getQueryString('language');
}

const i18n = new Vuei18n({
	locale, // 语言
	messages: {
		en, // 文案的英文版
        id,
	},
});
// if ('addEventListener' in document) {
//     document.addEventListener('DOMContentLoaded', function () {
//         FastClick.attach(document.body);
//     }, false);
// }

new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app');