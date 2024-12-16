/*
 * @Author: Elk
 * @Date: 2024-04-16 15:44:18
 * @FilePath: /yaame-h5/src/pages/EidLuckyDraw/EidLuckyDraw.js
 * @Description: 
 */
import Vue from 'vue';
import App from './EidLuckyDraw.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import Vuei18n from "vue-i18n";

Vue.use(Vuei18n);
import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
import ar from "./locale/ar-SA";
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
    silentTranslationWarn: true,
});

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
document.body.style.backgroundColor = '#3C241B';
new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app');
