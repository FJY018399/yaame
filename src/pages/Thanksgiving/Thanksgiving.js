import Vue from 'vue';
import App from './Thanksgiving.vue';
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
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
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
document.body.style.backgroundColor = "#DF7304";

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

new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app');