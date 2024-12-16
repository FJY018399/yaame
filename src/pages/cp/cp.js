/*
 * @Author: ZhaoZhiqi
 * @Date: 2023-12-14 14:34:22
 * @LastEditors: ZhaoZhiqi
 * @LastEditTime: 2023-12-18 17:51:49
 * @Description: 
 * @FilePath: \yaame-h5\src\pages\cp\cp.js
 */
import Vue from 'vue';
import App from './cp.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import Vuei18n from "vue-i18n";
import router from "./router";
import { Tab, Tabs, Popup, PasswordInput, NumberKeyboard } from 'vant';

Vue.use(Tab);
Vue.use(Tabs);
Vue.use(PasswordInput);
Vue.use(NumberKeyboard);
Vue.use(Popup);
Vue.use(Vuei18n);

import { getLanguage } from '../../lib/device';
let locale = getLanguage() || 'en';

import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
import ar from "./locale/ar";
if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn'].indexOf(locale) > -1) {
    let localEnum = {
        'zh-hk': 'tw',
        'zh-tw': 'tw',
        'zh-mo': 'tw',
        'zh-cn': 'zh',
    };

    locale = localEnum[locale];
}

const i18n = new Vuei18n({
	locale, // 语言
	messages: {
		en, // 文案的英文版
        id,
        zh,
        tw,
        ar,
	},
});
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}

document.body.style.backgroundColor = '#121520';

new Vue({
    i18n,
    router,
    render: h => h(App),
}).$mount('#app');