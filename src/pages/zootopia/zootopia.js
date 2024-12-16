/*
 * @Author: lianxiaoxia@weli.cn
 * @Date: 2022-12-07 10:20:39
 * @LastEditors: Please set LastEditors
 * @Description: 疯狂动物城
 * @FilePath: /yaame-h5/src/pages/zootopia/zootopia.js
 */
import Vue from 'vue';
import App from './zootopia.vue';
import FastClick from 'fastclick';
import '../../assets/css/reset.css';
import { Lazyload } from 'vant';

Vue.use(Lazyload, {
    filter: {
        thumbnail(listener, options) {
            const isPicOss = /peanut-oss.weli010.cn/;
            if (isPicOss.test(listener.src) && listener.src && listener.src.indexOf('.webp') < 0) {
                listener.src = `${listener.src}?iopcmd=thumbnail&type=4&width=40`;
            }
        }
    }
});

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}
import Vuei18n from "vue-i18n";
Vue.use(Vuei18n);
import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
import ar from "./locale/ar-SA";
import { getLanguage } from '../../lib/device';
import { getQueryString } from '../../lib/utils';
let locale = getLanguage() || 'en';

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
new Vue({
    i18n,
    render: h => h(App)
}).$mount('#app');