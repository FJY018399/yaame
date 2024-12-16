/*
 * @Author: Elk
 * @Date: 2024-09-10 19:57:48
 * @FilePath: /yaame-h5/src/pages/newUserGuide/newUserGuide.js
 * @Description: 
 */
import Vue from "vue";
import App from "./newUserGuide.vue";
import './../../assets/css/reset.css';
import Vuei18n from "vue-i18n";
import { Tab, Tabs } from "vant";

Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Vuei18n);


import en from "./locale/en-US";
import id from "./locale/in-ID";
import zh from "./locale/zh-CN";
import tw from "./locale/zh-TW";
import ar from "./locale/ar-SA";
import { getLanguage } from "../../lib/device";
import { getQueryString } from "../../lib/utils";
let locale = getLanguage() || "en";

if (getQueryString("language")) {
    locale = getQueryString("language");
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
        ar,
    },
});

document.body.style.backgroundColor = "#A3F8FF"
new Vue({
    i18n,
    render: (h) => h(App),
}).$mount("#app");
