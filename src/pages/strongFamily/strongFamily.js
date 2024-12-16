import Vue from 'vue';
import App from './strongFamily.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import '../../components/third/infinite-scroll/infinite-scroll';
import { Lazyload, DatetimePicker, Popup, List  } from 'vant';
import Vuei18n from "vue-i18n";
import { getLanguage } from '../../lib/device';
import { getQueryString } from '../../lib/utils';
import zh from './locale/zh-CN';
import tw from './locale/zh-TW';
import en from './locale/en-US';
import ar from './locale/ar-SA';
import id from './locale/in-ID';
Vue.use(DatetimePicker);
Vue.use(Popup);
Vue.use(List);
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

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

document.body.style.backgroundColor = '#301307';


new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app');