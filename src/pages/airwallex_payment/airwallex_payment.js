import Vue from 'vue';
import App from './airwallex_payment.vue';
import FastClick from 'fastclick';

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}

FastClick.prototype.focus = function (targetElement) {
    targetElement.focus();
};

import Vuei18n from "vue-i18n";
Vue.use(Vuei18n);
import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
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
        tw
	},
});

new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app');