/*
 * @Author: Se7enElk
 * @Date: 2022-04-07 14:56:15
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-29 14:35:48
 * @FilePath: /yaame-h5/src/pages/gift_illustration_desc/gift_illustration_desc.js
 * @Description: 
 */
import Vue from 'vue';

import App from './gift_illustration_desc.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
;
import Vuei18n from "vue-i18n";
Vue.use(Vuei18n);
import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
import ar from "./locale/ar-SA";
import { getLanguage } from '../../lib/device';
import { getQueryString } from '../../lib/utils';
let locale = getLanguage() || 'zh';

if (getQueryString('language')) {
    locale = getQueryString('language');
}

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
        ar
	},
});
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}
document.body.style.background = '#fff';
new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app');