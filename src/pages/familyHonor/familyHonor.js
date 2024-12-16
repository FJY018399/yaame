import Vue from 'vue';
import App from './familyHonor.vue';
import './../../assets/css/reset.css';
import FastClick from 'fastclick';
import '../../components/third/infinite-scroll/infinite-scroll';
import Vuei18n from 'vue-i18n';
import router from './router';
import { getLanguage } from '@/lib/device';
import { getQueryString } from '@/lib/utils';
import zh from './locale/zh-CN';
import tw from './locale/zh-TW';
import en from './locale/en-US';
import ar from './locale/ar-SA';
import id from './locale/in-ID';
import { List } from 'vant';

Vue.use(List);
Vue.use(Vuei18n);
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

if ('addEventListener' in document) {
    document.addEventListener(
        'DOMContentLoaded',
        function () {
            FastClick.attach(document.body);
        },
        false,
    );
}

document.body.style.backgroundColor = '#FADCAC';

new Vue({
    i18n,
    router,
    render: (h) => h(App),
}).$mount('#app');
