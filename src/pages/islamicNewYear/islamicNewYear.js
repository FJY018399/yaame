/*
 * @Author: Elk
 * @Date: 2024-06-28 15:02:06
 * @FilePath: /yaame-h5/src/pages/islamicNewYear/islamicNewYear.js
 * @Description: 
 */
import Vue from 'vue';
import App from './index.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import Vuei18n from "vue-i18n";
import router from './router.js';
import { Lazyload } from 'vant';
Vue.use(Lazyload);

Vue.use(Vuei18n);
import en from "./locale/en-US.js";
import id from "./locale/in-ID.js";
import zh from "./locale/zh-CN.js";
import tw from "./locale/zh-TW.js";
import ar from "./locale/ar-SA.js";
import { getLanguage } from '@/lib/device';
import { getQueryString } from '@/lib/utils';
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

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

document.body.style.backgroundColor = '#2A1441';
new Vue({
    i18n,
    router,
    render: h => h(App),
}).$mount('#app');
