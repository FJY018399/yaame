/*
 * @Author: Elk
 * @Date: 2024-08-21 11:41:10
 * @FilePath: /yaame-h5/src/pages/constellation/constellation.js
 * @Description:
 */
import Vue from 'vue';
import App from './constellation.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import { Popup } from 'vant';
import '../../components/third/infinite-scroll/infinite-scroll';
import router from './router';
import list from './list.json';
Vue.use(Popup);
if ('addEventListener' in document) {
    document.addEventListener(
        'DOMContentLoaded',
        function () {
            FastClick.attach(document.body);
        },
        false,
    );
}

import Vuei18n from 'vue-i18n';
Vue.use(Vuei18n);
import en from './locale/en-US';
import id from './locale/in-ID';
import zh from './locale/zh-CN';
import tw from './locale/zh-TW';
import ar from './locale/ar-SA';
import { getLanguage } from '../../lib/device';
import { getQueryString } from '../../lib/utils';
let locale = getLanguage() || 'en';

if (getQueryString('language')) {
    locale = getQueryString('language');
}
if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
    const localEnum = {
        'zh-hk': 'tw',
        'zh-tw': 'tw',
        'zh-mo': 'tw',
        'zh-cn': 'zh',
        zh_cn: 'zh',
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
    },
});

window.document.body.style.backgroundColor =
    list[new URLSearchParams(window.location.search).get('type')].backgroundColor;
// 全局注入当前样式
Vue.prototype.$list = list[new URLSearchParams(window.location.search).get('type')];

new Vue({
    i18n,
    router,
    render: (h) => h(App),
}).$mount('#app');
