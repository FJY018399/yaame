/*
 * @Author: Elk
 * @Date: 2023-04-07 11:00:26
 * @FilePath: /yaame-h5/src/pages/myReward/myReward.js
 * @Description: 
 */
import Vue from 'vue';
import { Tab, Tabs } from 'vant';
;
import App from './myReward.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import '../../components/third/infinite-scroll/infinite-scroll';
;
import Vuei18n from "vue-i18n";
Vue.use(Vuei18n);
Vue.use(Tab);
Vue.use(Tabs);
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
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function () {
        FastClick.attach(document.body);
    }, false);
}

FastClick.prototype.focus = function (targetElement) {
    targetElement.focus();
};

new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app');