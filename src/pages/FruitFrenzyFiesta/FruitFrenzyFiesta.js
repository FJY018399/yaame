/*
 * @Author: Elk
 * @Date: 2024-05-25 16:47:06
 * @FilePath: /yaame-h5/src/pages/FruitFrenzyFiesta/FruitFrenzyFiesta.js
 * @Description: 
 */
import Vue from 'vue';
import App from './FruitFrenzyFiesta.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import '../../components/third/infinite-scroll/infinite-scroll';
import Vuei18n from "vue-i18n";
import { getLanguage } from '../../lib/device';
import { getQueryString } from '../../lib/utils';
import zh from './locale/zh-CN';
import tw from './locale/zh-TW';
import en from './locale/en-US';
import ar from './locale/ar-SA';
import id from './locale/in-ID';
import { PullRefresh } from 'vant';

Vue.use(PullRefresh);
Vue.use(Vuei18n);
let locale = getLanguage() || 'en';

if (getQueryString('language')) {
    locale = getQueryString('language');
}
if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
    let localEnum = {
        'zh-hk': 'tw',
        'zh-tw': 'tw',
        'zh-mo': 'tw',
        'zh-cn': 'zh',
        "zh_cn": "zh",
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
FastClick.prototype.focus = function(targetElement) {
    var length;
    let deviceIsIOS = /IP(ad|hone|od)/.test(navigator.userAgent);
    if (
        deviceIsIOS &&
        targetElement.setSelectionRange &&
        targetElement.type.indexOf('date') !== 0 &&
        targetElement.type !== 'time' &&
        targetElement.type !== 'month' &&
        targetElement.type !== 'email'
    ) {
        length = targetElement.value.length;
        targetElement.setSelectionRange(length, length);
        targetElement.focus();
    } else {
        targetElement.focus();
    }
}
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

document.body.style.backgroundColor = '#470A1B';


new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app');