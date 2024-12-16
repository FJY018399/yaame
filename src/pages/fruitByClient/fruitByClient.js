/*
 * @Author: ZhaoZhiqi
 * @Date: 2023-06-19 17:36:01
 * @LastEditors: ZhaoZhiqi
 * @LastEditTime: 2023-06-27 18:51:54
 * @Description: 
 * @FilePath: \yaame-h5\src\pages\fruit_turntable\fruit_turntable.js
 */
import Vue from 'vue';
import App from './fruitByClient.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import '../../components/third/infinite-scroll/infinite-scroll';
import Vuei18n from "vue-i18n";

Vue.use(Vuei18n);

import { getLanguage } from '../../lib/device';
import { getQueryString } from '../../lib/utils';
let locale = getLanguage() || 'en';

if (getQueryString('language')) {
    locale = getQueryString('language');
}

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
        ar
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
    render: h => h(App),
}).$mount('#app');