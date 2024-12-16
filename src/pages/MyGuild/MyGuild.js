import Vue from 'vue';
import App from './index.vue';
import './../../assets/css/reset.css';
import './css/iconfont.css';
import FastClick from 'fastclick';
import Vuei18n from "vue-i18n";
import router from './router.js';
import { Lazyload, DatetimePicker, Popup, List, Search, ActionSheet } from 'vant';
import '../../components/third/infinite-scroll/infinite-scroll';
Vue.use(List);
Vue.use(DatetimePicker);
Vue.use(Popup);
Vue.use(Search);
Vue.use(ActionSheet);
Vue.use(Lazyload);

Vue.use(Vuei18n);
import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
import ar from "./locale/ar-SA";
import ph from "./locale/fil-PH";
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
        ar,
        ph
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
// document.body.style.backgroundColor = '#1B262D';
new Vue({
    i18n,
    router,
    render: h => h(App),
}).$mount('#app');
